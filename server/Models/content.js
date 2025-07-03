const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  lang: {
    type: String,
    default: "en",
  },
  home: {
    topLine1: String,
    topLine2: String,
    bookButton: String,
    sectionHeading: String,
    desc1: String,
    reviewHeading: String,
    review1Alt: String,
    review2Alt: String,
    prev: String,
    next: String,
    point1: {
      title: String,
      desc: String,
    },
    point2: {
      title: String,
      desc: String,
    },
    point3: {
      title: String,
      desc: String,
    },
    point4: {
      title: String,
      desc: String,
    },
    point5: {
      title: String,
      desc: String,
    },
  },
  about: {
    title: String,
    subtitle: String,
    breadcrumb: String,
    heading: String,
    welcome: String,
    offer: {
      heading: String,
      points: String,
    },
    mission: {
      heading: String,
      text: String,
    },
    why: {
      heading: String,
      text: String,
    },
    footer: String,
  },
  treatments: {
    pageTitle: String,
    description1: String,
    description2: String,
    description3: String,
    learnMore: String,
    imageAlt: String,
  },
  contact: {
    title: String,
    fullName: String,
    email: String,
    contactNumber: String,
    message: String,
    send: String,
    placeholderName: String,
    placeholderEmail: String,
    placeholderContact: String,
    placeholderMessage: String,
    faq: String,
    noFaqs: String,
    prev: String,
    next: String,
    page: String,
    toastSuccess: String,
    toastError: String,
  },
  nav: {
    home: String,
    about: String,
    treatments: String,
    doctors: String,
    contact: String,
    location: String,
  },
  footer: {
    tagline: String,
  },
  doctors: {
    title: String,
    specialization: String,
    imageAlt: String,
  },
  locations: {
    title: String,
    viewOnMap: String,
    fetchError: String,
  },
  brand: String,
  common: {
    home: String,
  },
});

module.exports = mongoose.model("Content", contentSchema);
