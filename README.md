### Cách chạy

1. Chỉnh sửa lại file `devcontainer.json`.
```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/typescript-node
{
	"name": "Social Media Content",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm",
	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},
	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],
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
	// Use 'postCreateCommand' to run commands after the container is created.
	// "postCreateCommand": "yarn install",
	// Configure tool-specific properties.
	// "customizations": {},
	// Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
	// "remoteUser": "root"
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