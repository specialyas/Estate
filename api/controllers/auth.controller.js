import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  // get username, email and password from the request
  const { username, email, password } = req.body;

  try {
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    //   console.log(hashedPassword);

    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "User created succesfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create User!!!" });
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // CHECK UF USER EXISTS

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "invalid credentials" });

    // CHECK IF PASSWORD IS VALID

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid crentials!!!" });

    // GENERATE COKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue");
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const {password: userPassword, ...userInfo} = user

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login unsucessfull !!!" });
  }
};

export const logout = (req, res) => {
  // clear cookie
  res.clearCookie("token").status(200).json({ message: "Logout succesfull" });
};
