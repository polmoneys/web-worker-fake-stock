export const picking = ctx => shapes => mouse => {
    const hitted = [];
    shapes.map(s => {
        if (ctx.isPointInPath(s.path, mouse.x, mouse.y)) {
            hitted.push(s);
        }
    });
    return hitted;
};


