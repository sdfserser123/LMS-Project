const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../modules/User.js');
const Session = require('../modules/Session.js')
const crypto = require('crypto');

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

const logIn = async (req, res) => {
    try {
        const {username, password} = req.body;
        console.log(`Đang đăng nhập với tài khoản "${username}" và mật khẩu "${password}`)
        if(!username || !password){
            return res.sendStatus(400);
        }

        const user = await User.findByUsername(username);

        if (!user){
            return res.status(401).json("Không tồn tại username");
        }
        console.log("Đã tìm thấy người dùng!")

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json("Password sai!");
        }

        const accessToken = jwt.sign({userid: user.userid}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL})

        const refreshToken = crypto.randomBytes(64).toString("hex")

        await Session.create({
            userId: user.userid,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        })

        return res.status(200).json({message: `User ${user.fullname} đã login!`, accessToken})

    } catch (error) {
        console.error("Lỗi khi gọi LogIn", error);
        return res.status(500).json({message: `Lỗi khi logIn`});
    }
};

const logOut = async (req, res) => {
    try {

        //lấy refreshToken trong cookie
        const token = req.cookies?.refreshToken

        if (token){
        //Xóa refreshToken trong sessions
            await Session.deleteByToken(token)
        }

        //Xóa cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        console.log("Log out thành công!")
        return res.sendStatus(204)
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Lỗi khi gọi LogOut" });
    }
};

module.exports = { logIn, logOut };