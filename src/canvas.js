import MathUtil from './engine/math';
import { shadeColor } from './engine/color';
import { picking } from './engine/utils';

function Canvas(options) {
    this.dpi = window.devicePixelRatio || 1;
    this.canvas = document.querySelector('canvas');
    this.canvas.addEventListener('click', this.click.bind(this), true);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.setAttribute('id', `${options.name || 'test'}-canvas`);
    //   this.canvas.style["opacity"] = ".2";
    this.canvas.setAttribute('height', rect.height * this.dpi);
    this.canvas.setAttribute('width', rect.width * this.dpi);
    const picking = document.createElement('canvas');
    picking.setAttribute('height', rect.height);
    picking.setAttribute('width', rect.width);
    picking.style['display'] = 'none';

    this.ctx = this.canvas.getContext('2d');
    this.ctx_pick = picking.getContext('2d');

    this.offset_left = rect.left;
    this.offset_top = rect.top;
    this.entities = [];
    this.mounted = true;

    this.render(options.input, options.viewport, options.meta);
}

Canvas.prototype.chunk_id = 0;

Canvas.prototype.render = function(datum, viewport, meta) {
    if (this.mounted) {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(this.dpi, this.dpi);
        const { min, mean, total } = viewport;
        const { max } = meta;

        ctx.save();
        const hittable_bars = [];

        datum.map((s, i) => {
            const bar_height = MathUtil.normie(s.value)(
                    max,
                    this.canvas.height / this.dpi
                ),
                bar_width = this.canvas.width / this.dpi / 10,
                options = {
                    x: (i * bar_width) / 2,
                    y: 0,
                    z: this.canvas.height / this.dpi - bar_height - i*20,
                    width: bar_width / 4,
                    height: bar_width / 4,
                    d: this.canvas.height / this.dpi - bar_height
                };
            const bar = this.render_cube(
                ctx,
                options.x,
                options.y,
                options.z,
                options.width,
                options.height,
                bar_height,
                '#ff0033',
                i,
            );
            
            hittable_bars.push({
                path: bar,
                id: i,
                value: s.value,
                label: s.label
            });
        });
        ctx.restore();

        this.hittable = hittable_bars;

        ctx.save();
        const mean_y = MathUtil.normie(mean)(
            max,
            (this.canvas.height / this.dpi )/ .7
        );
         
        this.line(ctx, 0, mean_y, 10, mean_y, '#191919');
        ctx.restore();

    } else {
        // ctx.save();
        //   ctx.setTransform(1, 0, 0, 1, 0, 0);
        //   ctx.clearRect(0, 0, this.width, this.height);
        //   ctx.scale(this.dpi, this.dpi);
        //   ctx.font = "500 18px Arial";
        //  ctx.fillStyle = "rgba(0,0,0,1)";
        //  const w = Math.round(ctx.measureText("LOADING...").width);
        //  ctx.fillText("LOADING...", this.center.x - w/2, this.center.y);
        // ctx.restore();
    }
};

Canvas.prototype.render_cube = function(
    ctx,
    x,
    y,
    z,
    w,
    h,
    d,
    color = '#ff5500',
    i

) {
    var p1 = MathUtil.toIso(x, y, z);
    var p2 = MathUtil.toIso(x + w, y, z);
    var p3 = MathUtil.toIso(x, y + h, z);
    var p4 = MathUtil.toIso(x + w, y + h, z);
    var p5 = MathUtil.toIso(x, y, z + d);
    var p6 = MathUtil.toIso(x + w, y, z + d);
    var p7 = MathUtil.toIso(x, y + h, z + d);
    var p8 = MathUtil.toIso(x + w, y + h, z + d);
    ctx.fillStyle = shadeColor(color, i * 10);

    const e = new Path2D();

    const top = new Path2D();
    top.moveTo(p1.x, p1.y);
    top.lineTo(p2.x, p2.y);
    top.lineTo(p4.x, p4.y);
    top.lineTo(p3.x, p3.y);

    const front = new Path2D();
    front.moveTo(p1.x, p1.y);
    front.lineTo(p2.x, p2.y);
    front.lineTo(p6.x, p6.y);
    front.lineTo(p5.x, p5.y);
    const right = new Path2D();
    right.moveTo(p4.x, p4.y);
    right.lineTo(p8.x, p8.y);
    right.lineTo(p6.x, p6.y);
    right.lineTo(p2.x, p2.y);
    ctx.save();
    ctx.fillStyle = shadeColor(color, i * -10);
    ctx.fill(right)
    ctx.restore();

    e.addPath(top);
    e.addPath(front);
    // e.addPath(right);
    e.closePath();
    ctx.fill(e);
    
    return e;
};

Canvas.prototype.update = function() {
    this.render();
};

Canvas.prototype.tooltip = function(ctx, v, x, y, size, weight) {
    // ctx.strokeStyle = "yellow";
    // ctx.lineWidth = 4;
    // ctx.lineCap = "round";
    // ctx.lineJoin = "round";
    ctx.font = `${weight} ${size}px Helvetica`;
    ctx.fillStyle = '#191919';
    // const w = Math.round(ctx.measureText(v).width);
    ctx.fillText(v, x, y);
};

Canvas.prototype.line = function(ctx, x, y, zx, zy, color ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * this.dpi;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const poly = new Path2D();
    poly.moveTo(x, y);
    poly.lineTo(zx, zy);
    ctx.stroke(poly);
};

Canvas.prototype.click = function(e) {
    const ctx = this.ctx;
    const mouse = {
        x: e.clientX - this.offset_left,
        y: e.clientY - this.offset_top
    };
    const hits = picking(this.ctx_pick)(this.hittable)(mouse);
    if (hits.length > 0) {
        ctx.clearRect(0, 0, 400, 100);
      this.tooltip(ctx, hits[0].label,250,42, 24, 300);
      this.tooltip(ctx, hits[0].value, 250, 98, 64, 600);
    }
};

Canvas.prototype.destroy = function() {
    this.ctx = null;
    this.canvas = null;
    // window.removeEventListener('mousemove', this.hover.bind(this), true);
    //  window.removeEventListener("resize", this.resize());
    window.removeEventListener('click', this.click.bind(this), true);
};

export default Canvas;
