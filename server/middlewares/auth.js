import jwt from "jsonwebtoken";

const extractToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies?.token) return req.cookies.token;
  return null;
};

export const authenticateUser = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id: decoded.id ?? decoded.sub,
      email: decoded.email ?? null,
      role: decoded.role ?? null,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error?.message ?? error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authenticateSeller = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return res.status(403).json({ message: "Not authorized as seller" });
    }

    const userObj = {
      _id: decoded.id ?? decoded.sub,
      email: decoded.email ?? null,
      role: decoded.role,
    };

  // controllers can use req.user or req.seller
    req.user = userObj;
    req.seller = userObj;

    next();
  } catch (error) {
    console.error("Seller auth error:", error?.message ?? error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUser;
