const mongoose = require('mongoose');

const RSSMsuSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  birthdate: { type: Date, required: true },
  gender: { type: String, required: true },
  profession: { type: String, required: true },
  whatsapp: { type: String, required: true },
  sangh: { type: String, required: true },
  category: { type: String, required: true },
  registrationId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Generate unique registrationId before saving
RSSMsuSchema.pre('save', async function(next) {
  if (!this.registrationId) {
    const Model = this.constructor;
    const count = await Model.countDocuments();
    this.registrationId = `RSSM-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('RSSMsu', RSSMsuSchema); 