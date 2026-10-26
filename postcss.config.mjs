import path from "node:path";

export default {
  plugins: {
    "@tailwindcss/postcss": {
      // Scan application sources without including generated files or logs.
      base: path.resolve(process.cwd(), "src"),
    },
  },
};
