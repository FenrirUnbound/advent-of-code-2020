#!/usr/bin/env python3
def read_input(filename):
    lines = []
    with open(filename) as fp:
        lines = fp.readlines()
    return lines


def tarzan(river, right, down):
    bottom = len(river)
    width = len(river[0]) - 1
    print(f'bottom: {bottom} ;; width: {width}')

    r_curr = 0+right
    d_curr = 0+down
    trees = 0
    while d_curr < bottom:
        line = river[d_curr]
        target = line[r_curr]
        #print(f'{d_curr},{r_curr}:  {target}')
        if target == '#':
            trees += 1
        r_curr = (r_curr + right) % width
        d_curr = (d_curr + down)

    return trees


def main():
    tob_map = read_input('./input.txt')
    #tob_map = read_input('./sample.txt')

    a = tarzan(tob_map, 1, 1)
    b = tarzan(tob_map, 3, 1)
    c = tarzan(tob_map, 5, 1)
    d = tarzan(tob_map, 7, 1)
    e = tarzan(tob_map, 1, 2)

    print(f'{a} - {b} - {c} - {d} - {e}')

if __name__ == '__main__':
    main()
