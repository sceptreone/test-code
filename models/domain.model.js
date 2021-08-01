const mongoose = require('mongoose');

const domainSchema = mongoose.Schema({
  domain: {
    type: String,
    required: true,
  },
  dateNow: {
    type: Number,
    required: true,
    default: 0,
  },
  sslInfo: {
    type: Object,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'crashed', 'cancel'],
    default: 'pending',
  },
  subScanId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubScan' },
  scanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scan' }
}, {
  timestamps: true
});

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;
