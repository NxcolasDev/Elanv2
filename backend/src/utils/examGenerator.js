const ieltsTopics = require("../data/ieltsTopics");

const getRandomTopics = () => {
  const shuffled = [...ieltsTopics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

module.exports = { getRandomTopics };