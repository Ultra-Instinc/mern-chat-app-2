# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and
some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
  uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the
configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
	// other rules...
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
		tsconfigRootDir: __dirname,
	},
};
```

- Replace `plugin:@typescript-eslint/recommended` to
  `plugin:@typescript-eslint/recommended-type-checked` or
  `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install
  [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and
  add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends`
  list

--🐞5:22:00 -> stuck cuz the res.cookie is not working --

--💡Fixed ====>>> forgot to add credentials:true in clientRequestHeaders

--🐞5:40:00 -> addingMessage is not handled correctly -- --💡Fixed ====>>> when
trying to access zustand store state in the handleMessageRecieved in
socketContext.. we had to use another hook
👩‍💻const{a,b,c}=useAppStore.getState()👩‍💻 to have the latest version of the data
in the store

-- 🖥️ Start handling files [MULTER_PACKAGE] >>> 6:15:00

-- 🖥️ File Download/Upload [PROGRESS] >>> 6:46:00

stopped at 8:18:00
