import json
def main():
    urls = []
    with open("./urls.txt") as f:
        urls = [line.strip() for line in f.readlines()]

    with open("./urls.json", "w") as out_file:
        obj = {
            "urls": urls
        }
        json.dump(obj, out_file, indent=4)

if __name__ == "__main__":
    main()
