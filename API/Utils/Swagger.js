import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesGlob = path.join(__dirname, "../Modules/**/*.js").replace(/\\/g, "/");

const descriptionMd = `
# مستندات وب‌سرویس کالج رکاد (Rokad Collage API Documentation)

### 📚 راهنمای پارامترهای سراسری در متدهای دریافت لیست (GET All):
- **جستجوی متنی (\`q\`):** جستجوی واژه در فیلدهای متنی مانند \`?q=برنامه‌نویسی\`
- **صفحه‌بندی (\`page\` و \`limit\`):** مانند \`?page=1&limit=10\`
- **مرتب‌سازی (\`sort\`):** مرتب‌سازی نزولی یا صعودی فیلدها مانند \`?sort=-createdAt\`
- **انتخاب فیلدها (\`fields\`):** دریافت فیلدهای دلخواه مانند \`?fields=title,category,icon\`
- **پیوند مراجع و فیلدهای مجازی (\`populate\`):**
  - در متدهای ماژول‌های ساده (\`User\`, \`Teacher\`, \`Blog\`) استفاده از کوئری پارامتر \`?populate=...\` مطابق \`vanta-api\` پشتیبانی می‌شود.
  - در متدهایی که دارای فیلدهای چندریختی یا مجازی هستند (\`InPersonCourse\`, \`VirtualCourse\`, \`Comment\`, \`Enrollment\`, \`Wallet\`)، به دلیل عدم پشتیبانی متغیرهای مجازی در \`ApiFeatures\`، مراجع مرتبط (نظیر \`teachers\`، \`course\`، \`session\` و \`user\`) مستقیماً و خودکار توسط کنترلرهای سرور پر (Populate) و بازگردانده می‌شوند.
- **فیلترهای پیشرفته (\`gte\`, \`lte\`, \`in\`, \`regex\`):** فیلتر روی خصوصیات مانند \`?category=گرافیک\`
`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rokad Collage API",
      version: "1.0.0",
      description: descriptionMd,
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [modulesGlob, "./Modules/**/*.js", "./API/Modules/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

