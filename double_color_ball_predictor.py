import random
import argparse
import os

# 彩票类型定义
LOTTERY_TYPES = {
    "ssq": {
        "name": "双色球",
        "description": "6个红球(1-33) + 1个蓝球(1-16)",
        "red_balls_count": 6,
        "red_balls_range": 33,
        "blue_balls_count": 1,
        "blue_balls_range": 16,
    },
    "dlt": {
        "name": "超级大乐透",
        "description": "5个前区号码(1-35) + 2个后区号码(1-12)",
        "red_balls_count": 5,
        "red_balls_range": 35,
        "blue_balls_count": 2,
        "blue_balls_range": 12,
    }
}


def generate_lottery_numbers(lottery_type="ssq", seed_modifier=0, random_seed=None):
    """
    生成彩票号码
    Generates lottery numbers
    
    Parameters:
    - lottery_type: 彩票类型 ("ssq" 或 "dlt")
    - seed_modifier: 种子修饰符，用于在生成多注时确保每注不同
    - random_seed: 可选随机种子，如果未提供则使用系统随机数
    """
    if lottery_type not in LOTTERY_TYPES:
        lottery_type = "ssq"  # 默认使用双色球
    
    lottery_config = LOTTERY_TYPES[lottery_type]
    
    # 设置随机种子
    if random_seed is not None:
        used_seed = random_seed + seed_modifier
        random.seed(used_seed)
    else:
        used_seed = random.randint(1, 1000000)
        random.seed(used_seed)
    
    print(f"使用的随机种子: {used_seed}")
    
    # 生成红球/前区号码
    red_balls = sorted(random.sample(range(1, lottery_config["red_balls_range"] + 1), 
                                     lottery_config["red_balls_count"]))
    
    # 生成蓝球/后区号码
    blue_balls = sorted(random.sample(range(1, lottery_config["blue_balls_range"] + 1), 
                                      lottery_config["blue_balls_count"]))
    
    return {
        'red_balls': red_balls,
        'blue_balls': blue_balls,
        'random_seed': random_seed
    }

def format_lottery_numbers(lottery_numbers, lottery_type="ssq"):
    """
    按指定格式格式化彩票号码
    """
    red_balls_str = ",".join([str(num).zfill(2) for num in lottery_numbers['red_balls']])
    blue_balls_str = ",".join([str(num).zfill(2) for num in lottery_numbers['blue_balls']])
    
    return f"{red_balls_str} + {blue_balls_str}"

def save_to_file(numbers_list, filename="lottery_numbers.txt"):
    """
    将号码列表保存到文件
    Save the list of formatted lottery numbers to a file
    """
    with open(filename, "w", encoding="utf-8") as file:
        for number_str in numbers_list:
            file.write(f"{number_str}\n")
    
    return filename

def main():
    # 设置命令行参数解析
    parser = argparse.ArgumentParser(description='基于天干地支预测彩票号码')
    parser.add_argument('-n', '--num', type=int, default=1, help='要生成的号码组数 (默认: 1)')
    parser.add_argument('-i', '--interactive', action='store_true', help='交互模式，通过用户输入确定注数')
    parser.add_argument('-o', '--output', type=str, default="", help='输出文件名 (默认: 使用彩票类型和日期作为文件名)')
    parser.add_argument('-t', '--type', type=str, choices=['ssq', 'dlt'], default='ssq', 
                        help='彩票类型: ssq=双色球, dlt=超级大乐透 (默认: ssq)')
    args = parser.parse_args()
    
    # 交互模式处理
    num_tickets = args.num
    if args.interactive:
        try:
            num_input = input("请输入要生成的注数 (1-100): ")
            num_tickets = int(num_input)
            if num_tickets < 1:
                num_tickets = 1
                print("注数不能小于1，已设为1注")
            elif num_tickets > 100:
                num_tickets = 100
                print("注数不能超过100，已设为100注")
        except ValueError:
            print("无效输入，使用默认值1注")
            num_tickets = 1
    
    lottery_type = args.type
    lottery_config = LOTTERY_TYPES[lottery_type]
    
    print(f"{lottery_config['name']}号码预测")
    print("-" * 40)
    
    print(f"彩票类型: {lottery_config['name']} ({lottery_config['description']})")
    print(f"生成注数: {num_tickets}")
    print("-" * 40)
    
    # 生成指定数量的彩票号码
    formatted_numbers = []
    # 生成初始随机种子
    first_seed = random.randint(1, 1000000)
    
    for i in range(num_tickets):
        # 第一注使用初始种子，后续注数使用初始种子+i
        lottery_numbers = generate_lottery_numbers(
            lottery_type=lottery_type,
            random_seed=first_seed,
            seed_modifier=i
        )
        formatted_number = format_lottery_numbers(lottery_numbers, lottery_type)
        formatted_numbers.append(formatted_number)
        
        # 输出结果，添加序号
        print(f"第 {i+1} 注:")
        if lottery_type == "ssq":
            print(f"红球: {' '.join([str(num).zfill(2) for num in lottery_numbers['red_balls']])}")
            print(f"蓝球: {' '.join([str(num).zfill(2) for num in lottery_numbers['blue_balls']])}")
        else:  # dlt
            print(f"前区: {' '.join([str(num).zfill(2) for num in lottery_numbers['red_balls']])}")
            print(f"后区: {' '.join([str(num).zfill(2) for num in lottery_numbers['blue_balls']])}")
        print(f"格式化: {formatted_number}")
        print()
    
    # 保存到文件
    if args.output:
        filename = args.output
    else:
        filename = f"./doc/{lottery_type}.txt"
    
    saved_filename = save_to_file(formatted_numbers, filename)
    print(f"号码已保存到文件: {os.path.abspath(saved_filename)}")

if __name__ == "__main__":
    main()