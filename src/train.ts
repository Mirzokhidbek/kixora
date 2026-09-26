/* Project Standards:
  - Logging standards
  - Naming standards
      function, method, variable => CAMEL
      class => PASCAL
      folder, file => KEBAB-CASE / CAMEL
      css => KEBAB-CASE

  - WebServer & Authentication Process:
      VPS (Virtual Private Server) vs VPC (Virtual Private Cloud)
      Authentication (Identity verification) vs Authorization (Permission check)
      Session-Based Authentication (BSSR / EJS Cookies)
      Token-Based Authentication (JWT / SPA React)
      Browser Storages: Cookie, LocalStorage, SessionStorage

  - SPA Order Management & Status Transitions (Dars 72):
      1. `POST /order/update`:
         - `req.body`: `{ orderId: string, orderStatus: OrderStatus }`.
         - Foydalanuvchining buyurtma statusini yangilaydi (`PAUSE` -> `PROCESS` -> `FINISH` yoki `DELETE`).
         - `FINISH` statusiga o'tganda, to'langan har $10 uchun foydalanuvchiga 1 ta sodiqlik bali (`memberPoints`) qo'shiladi.

  - React Foundations & Hooks Paradigm (Dars 73):
      1. Class vs Functional Components:
         - Class Components: `this.state`, `this.setState`, Lifecycle metodlari (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).
         - Functional Components: Hooklar (`useState`, `useEffect`), soddaroq sintaksis, xotirani tejash va unumdorlik.
      2. `useState`: Mahalliy holat (state)ni saqlash va yangilash.
      3. `useEffect`: Nojo'ya ta'sirlar (side-effects)ni boshqarish:
         - `useEffect(() => {}, [])`: `componentDidMount` (birlamchi renderdan so'ng 1 marta ishlaydi).
         - `useEffect(() => {}, [dep])`: `componentDidUpdate` (bog'liqlik o'zgarganda ishlaydi).
         - `useEffect(() => () => {}, [])`: `componentWillUnmount` (komponent o'chirilganda tozalash).

  - Redux Architecture & Redux Toolkit (Dars 74):
      1. Redux tamoyili: `Store` (yagona global holat), `Actions` (hodisalar), `Reducers` (holatni o'zgartiruvchi sof funksiyalar), `Dispatch` (action yuborish), `Selector` (state dan ma'lumot o'qish).
      2. Redux Toolkit (`@reduxjs/toolkit` & `react-redux`):
         - `configureStore`: Bir nechta reducerlarni yagona markaziy do'konga birlashtiradi.
         - `createSlice`: Reducer va Actionlarni bir joyda ixcham hosil qiladi.
         - Immer JS integratsiyasi: Obyektlarni chuqur nusxalamasdan to'g'ridan-to'g'ri mutatsiya qilish imkoniyati.
      3. Loyihada yaratilgan Slicelar:
         - `homePageSlice`: `popularDishes`, `newDishes`, `topUsers`.
         - `productsPageSlice`: `restaurant`, `chosenProduct`, `products`.
         - `ordersPageSlice`: `pausedOrders`, `processOrders`, `finishedOrders`.
*/
