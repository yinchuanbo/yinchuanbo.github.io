## 创建专题提示词

### 为我创建一系列 TypeScript 学习文档

1. 基于最新版的 TypeScript 来创建学习文档

2. 从基础到高级，每个文档都包含详细的知识点和实例演示

3. 需要包含所有知识点，需要是一个完整的学习系列

4. 新建的 md 文件名用数字命名，如 01.md、02.md、03.md 等

5. 新建的 md 文件格式，参考：src/SCSS/02.md

6. 新生成的 md 文档统一放在 src/TypeScript 文件夹下

7. 生成的时候请先给出所有系列的文档名称，我确认并输入 “继续” 之后，再进行后续生成

8. 每次只生成2个文档，我确认并输入 “继续” 之后，再进行后续生成


## 彩票生成

```bash
# 生成1注双色球号码（默认）
python double_color_ball_predictor.py

# 生成超级大乐透号码
python double_color_ball_predictor.py -t dlt

# 生成指定注数的号码
python double_color_ball_predictor.py -n 5            # 生成5注双色球
python double_color_ball_predictor.py -t dlt -n 5     # 生成3注大乐透

# 交互式输入注数
python double_color_ball_predictor.py -i              # 双色球交互模式
python double_color_ball_predictor.py -t dlt -i       # 大乐透交互模式

# 将生成的号码保存到指定文件
python double_color_ball_predictor.py -n 3 -o my_ssq.txt
python double_color_ball_predictor.py -t dlt -n 3 -o my_dlt.txt

# 不指定文件名时，将使用彩票类型和日期作为文件名
# 例如: ssq_20240815.txt 或 dlt_20240815.txt
```

### 命令行参数

- `-n, --num`: 指定要生成的号码注数 (默认: 1)
- `-i, --interactive`: 启用交互模式，通过用户输入确定注数
- `-o, --output`: 指定输出文件名 (默认使用彩票类型和日期作为文件名)
- `-t, --type`: 彩票类型，可选值: ssq=双色球, dlt=超级大乐透 (默认: ssq)

