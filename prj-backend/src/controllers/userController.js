const User = require('../modules/User')

const authMe = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({user})
        
    } catch (error) {
        console.error('Lỗi khi gọi AuthMe', error)
        return res.status(500).json({message: 'Lỗi hệ thống'})
    }
};

// POST /api/users
const addUser = async (req, res) => {
  try {
    const { fullname, username, email, password, role } = req.body

    // validate
    if (!fullname || !username || !email || !password || !role) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' })
    }

    // chỉ admin mới được thêm user


    const existingUser = await User.findByUsername(username)
    if (existingUser) {
      return res.status(409).json({ message: 'Username đã tồn tại' })
    }

    const result = await User.addUser({
      fullname,
      username,
      email,
      password,
      role
    })

    return res.status(201).json({
      message: 'Tạo user thành công',
      data: result
    })
  } catch (error) {
    console.error('Lỗi khi addUser', error)
    return res.status(500).json({ message: 'Lỗi hệ thống' })
  }
}

const test = async (req, res) => {
    return res.sendStatus(204)
}

module.exports = {
  authMe,
  addUser,
  test
}