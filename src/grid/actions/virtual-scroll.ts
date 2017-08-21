import { IGrid, IAction } from '../base/interface';
import { getRowHeight } from '../base/util';
import { initialLoad } from '../base/constant';
import { RenderType } from '../base/enum';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualContentRenderer, VirtualHeaderRenderer }  from '../renderer/virtual-content-renderer';
/**
 * Virtual Scrolling class
 */
export class VirtualScroll implements IAction {
    private parent: IGrid;
    private blockSize: number;
    private locator: ServiceLocator;
    constructor(parent: IGrid, locator?: ServiceLocator) {
        this.parent = parent;
        this.locator = locator;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'virtualscroll';
    }

    private instantiateRenderer(): void {
        let renderer: RendererFactory = this.locator.getService<RendererFactory>('rendererFactory');
        if (this.parent.enableColumnVirtualization) {
            renderer.addRenderer(RenderType.Header, new VirtualHeaderRenderer(this.parent, this.locator));
        }
        renderer.addRenderer(RenderType.Content, new VirtualContentRenderer(this.parent, this.locator));
        this.ensurePageSize();
    }

    public ensurePageSize(): void {
        let rowHeight: number = getRowHeight(this.parent.element);
        this.blockSize = ~~(<number>this.parent.height / rowHeight);
        let height: number =  this.blockSize * 2;
        let size: number = this.parent.pageSettings.pageSize;
        this.parent.setProperties({ pageSettings: { pageSize: size < height ? height : size }}, true);
    }

    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(initialLoad, this.instantiateRenderer, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(initialLoad, this.instantiateRenderer);
    }

    public destroy(): void {
        this.removeEventListener();
    }
}