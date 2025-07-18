const jwt = require("jsonwebtoken");
const User = require("../../src/modules/user/model/user.model");

const protectRoute = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.jwt;

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - No Token Provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid Token" });
      }

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({ message: "You are not authorized for this request" });
      }

      req.user = user;

      if (requiredPermission) {
        const userPermissions = user.permissions || [];

        const hasPermission = userPermissions.includes(requiredPermission);
        if (!hasPermission) {
          return res
            .status(403)
            .json({ message: "Forbidden - Insufficient Permissions" });
        }
      }

      next();
    } catch (error) {
      console.log("Error in protectRoute middleware: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = protectRoute;
