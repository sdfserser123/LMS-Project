const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../modules/User.js');
const Session = require('../modules/Session.js')
const ActivityLog = require('../modules/ActivityLog.js');
const crypto = require('crypto');

const ACCESS_TOKEN_TTL = '2h';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Đang đăng nhập với tài khoản "${username}" và mật khẩu "${password}`)
        if (!username || !password) {
            return res.sendStatus(400);
        }
        const user = await User.findByUsername(username);

        if (!user) {
            await ActivityLog.create({
                userId: null,
                action: 'LOGIN_FAILED',
                ip: req.ip,
                details: { reason: 'User not found', username }
            });
            return res.status(401).json("Không tồn tại username");
        }
        console.log("Đã tìm thấy người dùng!")

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            await ActivityLog.create({
                userId: user.userid,
                action: 'LOGIN_FAILED',
                ip: req.ip,
                details: { reason: 'Incorrect password' }
            });
            return res.status(401).json("Password sai!");
        }

        const accessToken = jwt.sign({ userid: user.userid, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL })

        const refreshToken = crypto.randomBytes(64).toString("hex")

        await Session.create({
            userId: user.userid,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // MUST be false for localhost (HTTP)
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_TTL,
        })

        await ActivityLog.create({
            userId: user.userid,
            action: 'LOGIN',
            ip: req.ip,
            details: { message: `User ${user.fullname} logged in` }
        });

        return res.status(200).json({ message: `User ${user.fullname} đã login!`, accessToken })

    } catch (error) {
        console.error("Lỗi khi gọi LogIn", error);
        return res.status(500).json({ message: `Lỗi khi logIn` });
    }
};

const logOut = async (req, res) => {
    try {

        //lấy refreshToken trong cookie
        const token = req.cookies?.refreshToken

        if (token) {
            //Xóa refreshToken trong sessions
            await Session.deleteByToken(token)
        }

        //Xóa cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false, // MUST be false for localhost (HTTP)
            sameSite: 'lax',
        });

        console.log("Log out thành công!")
        return res.sendStatus(204)
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Lỗi khi gọi LogOut" });
    }

};
//tạo access token mới từ refresh token
const refreshToken = async (req, res) => {
    try {

        //lấy refreshToken từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Token không tồn tại' })
        }

        //so với refresh token trong db
        const session = await Session.findByToken(token);

        if (!session) {
            return res.status(403).json({ message: 'Token không hợp lệ' })
        }

        //kiểm tra hạn của token
        if (session.expires_at < new Date()) {
            return res.status(403).json({ message: 'Token đã hết hạn' })
        }


        //tạo access token mới
        const accessToken = jwt.sign({
            userid: session.user_id
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL })

        //return token
        return res.status(200).json({ accessToken })

    } catch (error) {
        console.error("Lỗi khi gọi refreshToken", error)
        return res.status(500).json({ message: 'Lỗi hệ thống' })
    }
}

module.exports = { logIn, logOut, refreshToken };