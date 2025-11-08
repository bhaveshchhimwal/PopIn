import jwt from "jsonwebtoken";

const Auth = (req, res, next) => {
  try {
    let token = null;


    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = {
      id: decoded.id ?? decoded.sub,
      email: decoded.email ?? null,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error?.message ?? error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default Auth;
