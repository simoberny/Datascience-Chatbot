import sys, json

def read_in():
    lines = sys.stdin.read()
    return lines;

def main():
    lines = read_in()
    addendi = lines.split('+')

    print(int(addendi[0])+int(addendi[1]))

# Start process
if __name__ == '__main__':
    main()