# 古签解语

传统签诗在线抽签网站。

## 功能

- 🎲 随机抽取60支传统签诗
- 📜 先显示古文签诗（公有领域，无版权问题）
- 🔮 扫码付款后显示详细AI解签

## 部署

已部署到 GitHub Pages: https://tj-lab111.github.io/cihang-lingqian/

## 收款二维码设置

1. 准备你的收款二维码图片（支付宝/微信）
2. 将图片命名为 `qr-code.png`
3. 放在本目录下
4. 重新推送到GitHub

或者修改 `index.html` 中的 `.qr-fallback` 部分，填写你的微信ID。

## 文件结构

```
cihang-lingqian/
├── index.html      # 主页面
├── style.css       # 样式表
├── script.js       # 交互逻辑
├── qian-data.js    # 签文数据
├── qr-code.png     # 收款二维码（需自行添加）
└── README.md       # 说明文档
```

## 版权声明

- 签诗为传统民俗文化，属于公有领域
- 解签内容由AI生成，仅供参考娱乐
- 不构成任何决策建议

## 许可证

MIT License
