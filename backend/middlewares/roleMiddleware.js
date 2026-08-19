"use strict";

// Dipakai setelah authMiddleware. Contoh: roleMiddleware('maker', 'approver')
module.exports = function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Belum terautentikasi" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Anda tidak memiliki akses untuk aksi ini" });
    }

    next();
  };
};
