export const getRandomItemInMap = (iterable: Map<string, any>) => iterable.get([...iterable.keys()][Math.floor(Math.random() * iterable.size)]);

export const getRandomKeyInMap = (iterable: Map<string, any>) => [...iterable.keys()][Math.floor(Math.random() * iterable.size)];

export const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
