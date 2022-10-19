export const parseCurrentURL = () => {
    const urlParts = {};

    [urlParts.page, urlParts.id] = location.hash.slice(2).split('/');

    return urlParts;
};