import { applicationConfig } from "./src/constant.js";
import app from "./src/app.js";

app.listen(applicationConfig.PORT, () => {
  console.log(`Server is running on port ${applicationConfig.PORT}`);
});