### Cách chạy

1. Chỉnh sửa lại file `devcontainer.json`.
```json
{
	"name": "Social Media Content",
	"image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
	"customizations": {
		"vscode": {
			"extensions": [
				"dbaeumer.vscode-eslint",
				"EditorConfig.EditorConfig",
				"ms-vscode.vscode-typescript-tslint-plugin",
				"eg2.vscode-npm-script",
				"christian-kohler.path-intellisense",
				"sibiraj-s.vscode-scss-formatter",
				"gruntfuggly.todo-tree",
				"meganrogge.template-string-converter",
				"esbenp.prettier-vscode",
				"github.vscode-pull-request-github",
				"eamodio.gitlens",
				"ecmel.vscode-html-css",
				"ritwickdey.LiveServer",
				"GitHub.copilot",
				"firsttris.vscode-jest-runner",
				"ecmel.vscode-html-css",
				"rangav.vscode-thunder-client",
				"cweijan.dbclient-jdbc",
				"cweijan.vscode-redis-client",
				"GitHub.copilot"
			]
		}
	}
}
```

2. Mở thư mục trong container.

3. Chạy lệnh cài đặt dependencies:
```bash
npm install
```

4. Chạy ứng dụng:
```bash
npm run dev
```