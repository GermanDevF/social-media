import ky from "ky";

const kyInstance = ky.create({
  parseJson: (text) => {
    try {
      return JSON.parse(text, (key, value) => {
        if (key.endsWith("At")) return new Date(value);
        return value;
      });
    } catch (error) {
      return text;
    }
  },
});

export default kyInstance;
