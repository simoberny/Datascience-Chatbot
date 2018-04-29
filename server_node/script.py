import sys, json

def read_in():
    lines = sys.stdin.readlines()
    return lines[0];

def main():
    lines = read_in()

    print(int(lines[0])+int(lines[2]))

# Start process
if __name__ == '__main__':
    main()