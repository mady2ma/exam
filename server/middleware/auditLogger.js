const AuditLog = require('../models/AuditLog');

module.exports = (action, options = {}) => {
  return async (req, res, next) => {
    try {
      const logEntry = {
        action,
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        ...options
      };

      if (req.params.id) {
        logEntry.examId = req.params.id;
      }

      await AuditLog.create(logEntry);
    } catch (err) {
      console.error('Audit logging failed:', err);
    }
    next();
  };
};