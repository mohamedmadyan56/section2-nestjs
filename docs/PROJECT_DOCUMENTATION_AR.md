# توثيق مشروع `nestjs-fundamentals`

## نظرة عامة
- **الهدف**: مشروع صغير للتدرّب على أساسيات NestJS وبناء REST API.
- **النطاق الحالي**: إدارة Users (CRUD) بدون قاعدة بيانات.
- **تخزين البيانات**: داخل الذاكرة (In-memory) في مصفوفة داخل `UserController`، وبالتالي **أي بيانات بتضيع عند إعادة تشغيل السيرفر**.

> يوجد شرح عربي/إنجليزي جاهز أيضًا داخل `docs/`:
> - `docs/nestjs-fundamentals-explanation-ar-en.html`
> - `docs/nestjs-fundamentals-explanation-ar-en.pdf`

## المتطلبات
- Node.js + npm
- (اختياري) Nest CLI

## تشغيل المشروع محليًا
```bash
npm install
npm run start:dev
```

السيرفر بيشتغل على:
- `http://localhost:3000`
- أو قيمة `PORT` إن كانت موجودة في environment variables.

## هيكل المشروع (أهم الملفات)
- **`src/main.ts`**: نقطة تشغيل التطبيق + تفعيل Global Validation.
- **`src/app.module.ts`**: Root module ويستورد `UserModule`.
- **`src/user/user.module.ts`**: Feature module للمستخدمين ويسجّل `UserController`.
- **`src/user/user.controller.ts`**: الـEndpoints الخاصة بالمستخدمين (CRUD).
- **`src/user/user.entity.ts`**: شكل كائن المستخدم داخل النظام.
- **`src/user/dtos/create-user.dto.ts`**: DTO لإنشاء مستخدم + validations.
- **`src/user/dtos/update-user.dto.ts`**: DTO للتحديث مبني على `PartialType` (كل الحقول اختيارية).
- **`src/user/pipes/validation.pipe.ts`**: مثال Pipe بسيط لتحويل/تعديل قيمة مدخلة.

## كيف يبدأ التطبيق؟
في `main.ts` يتم:
- إنشاء التطبيق عبر `NestFactory.create(AppModule)`
- تفعيل Global `ValidationPipe` بالإعدادات:
  - `whitelist: true`: يشيل أي fields زيادة غير موجودة في DTO.
  - `forbidNonWhitelisted: true`: بدل ما يشيلها بصمت، يرمي **400 Bad Request** لو فيه fields زيادة.
- الاستماع على `PORT` أو `3000`.

## جزء المستخدمين (Users)
### Base Route
السطر `@Controller('users')` في `UserController` معناه أن كل الـroutes تبدأ بـ:
- `/users`

### الـEntity
`UserEntity` يعرّف خصائص المستخدم:
- `id` (UUID)
- `username`
- `email`
- `country`

### الـDTOs والـValidation
#### `CreateUserDto`
يستخدم `class-validator`:
- `username`: لازم `string`
- `email`: لازم `email`
- `country`: موجودة في الـDTO لكن **غير مقيّدة حاليًا** بديكورات Validation

#### `UpdateUserDto`
مبني على:
- `PartialType(CreateUserDto)`  
يعني نفس حقول الإنشاء ولكن كلها **اختيارية** في التحديث.

## الـPipes المستخدمة
- **`ParseUUIDPipe`**: مستخدم في `:id` للتأكد أن الـid UUID صحيح، وإلا يرجّع 400.
- **Global `ValidationPipe`**: شغال على مستوى التطبيق.
- **`CustomValidationPipe`**: مستخدم على `Query` parameter اسمه `username` في `GET /users`، ويحوّل القيمة إلى `DEV<value>` (كمثال على transformation).

> ملاحظة: `username` في `GET /users` حاليًا لا يتم استخدامه لفلترة النتائج؛ الدالة ترجع `this.users` كما هي.

## الـAPI Endpoints
### 1) Get All Users
- **Method**: `GET`
- **Path**: `/users`
- **Query (اختياري)**: `username` (يتم تمريره عبر `CustomValidationPipe`)
- **Response**: `UserEntity[]`

مثال:
```bash
curl -s "http://localhost:3000/users?username=ali"
```

### 2) Get One User
- **Method**: `GET`
- **Path**: `/users/:id`
- **Validation**: `id` لازم UUID
- **Response**: `UserEntity | undefined`

مثال:
```bash
curl -s "http://localhost:3000/users/0c8c6f7b-2b5a-4d58-9b74-6e4f2f3d1c2a"
```

### 3) Create User
- **Method**: `POST`
- **Path**: `/users`
- **Body**: `CreateUserDto`
- **Behavior**:
  - يتم توليد `id` بواسطة مكتبة `uuid`
  - يتم حفظ المستخدم في مصفوفة `users` داخل الـcontroller

مثال:
```bash
curl -s -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{"username":"Ali","email":"ali@mail.com","country":"Egypt"}'
```

### 4) Update User
- **Method**: `PATCH`
- **Path**: `/users/:id`
- **Body**: `UpdateUserDto` (كل الحقول اختيارية)
- **Response**: المستخدم بعد التحديث

مثال:
```bash
curl -s -X PATCH "http://localhost:3000/users/0c8c6f7b-2b5a-4d58-9b74-6e4f2f3d1c2a" \
  -H "Content-Type: application/json" \
  -d '{"country":"KSA"}'
```

### 5) Delete User
- **Method**: `DELETE`
- **Path**: `/users/:id`
- **Response**: `204 No Content`

مثال:
```bash
curl -i -X DELETE "http://localhost:3000/users/0c8c6f7b-2b5a-4d58-9b74-6e4f2f3d1c2a"
```

## ملاحظات مهمة على الكود الحالي (للتعلم)
- **لا يوجد Service Layer**: كل المنطق موجود داخل `UserController` (مناسب للتعلّم، لكن ليس الأفضل في مشروع حقيقي).
- **لا يوجد Database**: البيانات في الذاكرة فقط.
- **`GET /users/:id`**: لو المستخدم غير موجود، بيرجع `undefined` بدل `404` (يمكن تحسينه لاحقًا).
- **`PATCH /users/:id`**: في حالة ID غير موجود، `findIndex` قد يرجع `-1` وبالتالي سلوك غير آمن (ممكن إضافة تحقق وإرجاع `404`).

