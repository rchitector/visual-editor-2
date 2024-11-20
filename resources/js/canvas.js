export default class Canvas {

    #container = null;
    #canvas = null;
    #maxCanvasWidth = 0;
    #maxCanvasHeight = 0;
    #baseCellSize = 20;
    #defaultScale = 1;
    #scale = 1;
    #scaleStep = -0.001;
    #minScale = 0.05;
    #maxScale = 10;

    #translateX = 0;
    #translateY = 0;

    #isDragging = false;
    #lastMouseX = null;
    #lastMouseY = null;

    constructor(containerId) {
        if (!containerId) {
            throw new Error("containerId not defined");
        }

        const containerElement = document.getElementById(containerId);
        if (!containerElement) {
            throw new Error("container element not found");
        }

        this.#container = containerElement;
    };

    start() {
        this.#initContainer();
        this.#initCanvas();
        this.#initMouseEvents();
        // this.#addFakeData();
    };

    #initContainer = () => {
        this.#container.classList.add("relative");
        this.#container.classList.add("overflow-hidden");
        this.#container.classList.add("box-border");
        this.#container.classList.add("bg-gray-50");
        this.#container.classList.add("dark:bg-gray-800");
        this.#container.classList.add("bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]");
        this.#container.classList.add(`bg-[size:${this.#baseCellSize}px_${this.#baseCellSize}px]`);
    };

    #initCanvas = () => {
        this.#canvas = document.createElement("div");
        this.#canvas.classList.add("absolute");
        this.#canvas.classList.add("select-none");
        this.#canvas.classList.add("inset-0");
        this.#canvas.style.width = `${this.#maxCanvasWidth}px`;
        this.#canvas.style.height = `${this.#maxCanvasHeight}px`;
        this.#container.appendChild(this.#canvas);
        this.#centerCanvas();
    };

    #centerCanvas = () => {
        const parentRect = this.#container.getBoundingClientRect();
        this.#scale = 1;
        this.#translateX = (parentRect.width - parseFloat(this.#canvas.style.width)) / 2;
        this.#translateY = (parentRect.height - parseFloat(this.#canvas.style.height)) / 2;
        this.#updateStyles();
    };

    #updateStyles = () => {
        this.#canvas.style.transform = this.#generateTransform(this.#translateX, this.#translateY, this.#scale);
        const {scaleX, scaleY, translateX, translateY} = this.#parseTransform(this.#canvas)
        const scaledCellSizeX = this.#baseCellSize * scaleX;
        const scaledCellSizeY = this.#baseCellSize * scaleY;
        const translateCellSizeX = translateX % scaledCellSizeX;
        const translateCellSizeY = translateY % scaledCellSizeY;
        this.#container.style.backgroundSize = `${scaledCellSizeX}px ${scaledCellSizeY}px`;
        this.#container.style.backgroundPosition = `${translateCellSizeX}px ${translateCellSizeY}px`;
    }

    #generateTransform = (translateX, translateY, scale = this.#scale) => {
        return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`
    };

    #parseTransform = (element) => {
        const values = element.style.transform.match(/matrix\((.+)\)/)[1].split(", ");
        return {
            scaleX: parseFloat(values[0]),
            scaleY: parseFloat(values[3]),
            translateX: parseFloat(values[4]),
            translateY: parseFloat(values[5]),
        };
    };

    #initMouseEvents = () => {
        this.#container.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        this.#container.addEventListener('mousedown', (event) => {
            this.#isDragging = true;
            this.#lastMouseX = event.clientX;
            this.#lastMouseY = event.clientY;
        });

        this.#container.addEventListener('wheel', (event) => {
            event.preventDefault();
            const rect = this.#container.getBoundingClientRect();
            const cursorX = event.clientX - rect.left;
            const cursorY = event.clientY - rect.top;
            const oldScale = this.#scale;
            this.#scale += event.deltaY * this.#scaleStep;
            this.#scale = Math.min(this.#maxScale, Math.max(this.#minScale, this.#scale));
            this.#translateX -= (cursorX - this.#translateX) * (this.#scale / oldScale - this.#defaultScale);
            this.#translateY -= (cursorY - this.#translateY) * (this.#scale / oldScale - this.#defaultScale);
            this.#updateStyles();
        });

        document.addEventListener('mousemove', (event) => {
            if (this.#isDragging) {
                this.#translateX += (event.clientX - this.#lastMouseX);
                this.#translateY += (event.clientY - this.#lastMouseY);
                this.#lastMouseX = event.clientX;
                this.#lastMouseY = event.clientY;
                this.#updateStyles();
            }
        });

        document.addEventListener('mouseup', (event) => {
            this.#isDragging = false;
            this.#lastMouseX = null;
            this.#lastMouseY = null;
        });
    };

    #addFakeData = () => {
        const ul = document.getElementById('sidebar-bottom-list');
        const li = document.createElement("li");
        ul.appendChild(li);

        const info1 = document.createElement("div");
        info1.setAttribute("id", "info1");
        info1.setAttribute("class", "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group");
        li.appendChild(info1);

        const info2 = document.createElement("div");
        info2.setAttribute("id", "info2");
        info2.setAttribute("class", "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group");
        info2.addEventListener('mouseover', (e) => {
            let redShadow = 'red 0px 0px 0px 2px inset';
            const originalBoxShadow = window.getComputedStyle(this.#container).boxShadow;
            if (originalBoxShadow !== 'none') {
                this.#container.setAttribute('originalBoxShadow', originalBoxShadow);
                redShadow = `${originalBoxShadow}, ${redShadow}`;
            }
            this.#container.style.boxShadow = redShadow;
        });
        info2.addEventListener('mouseout', (e) => {
            const originalBoxShadow = this.#container.getAttribute('originalBoxShadow');
            if (originalBoxShadow !== 'none') {
                this.#container.style.boxShadow = originalBoxShadow;
                this.#container.removeAttribute('originalBoxShadow');
            } else {
                this.#container.style.boxShadow = null;
            }
        });
        li.appendChild(info2);

        const info3 = document.createElement("div");
        info3.setAttribute("id", "info3");
        info3.setAttribute("class", "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group");
        info3.addEventListener('mouseover', (e) => {
            let redShadow = 'red 0px 0px 0px 2px inset';
            const originalBoxShadow = window.getComputedStyle(this.#canvas).boxShadow;
            if (originalBoxShadow !== 'none') {
                this.#canvas.setAttribute('originalBoxShadow', originalBoxShadow);
                redShadow = `${originalBoxShadow}, ${redShadow}`;
            }
            this.#canvas.style.boxShadow = redShadow;
        });
        info3.addEventListener('mouseout', (e) => {
            const originalBoxShadow = this.#canvas.getAttribute('originalBoxShadow');
            if (originalBoxShadow !== 'none') {
                this.#canvas.style.boxShadow = originalBoxShadow;
                this.#canvas.removeAttribute('originalBoxShadow');
            } else {
                this.#canvas.style.boxShadow = null;
            }
        });
        li.appendChild(info3);

        const scaleSlider = document.createElement("input");
        scaleSlider.setAttribute('id', 'scale-range')
        scaleSlider.setAttribute('type', 'range')
        scaleSlider.setAttribute('value', '1')
        scaleSlider.setAttribute('min', this.#minScale)
        scaleSlider.setAttribute('max', this.#maxScale)
        scaleSlider.setAttribute('step', '0.01')
        scaleSlider.setAttribute('class', 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700')
        scaleSlider.addEventListener('input', (e) => {
            document.getElementById('scale-range-label').innerText = `Scale range: ${e.target.value}`;
            this.#scale = Math.min(this.#maxScale, Math.max(this.#minScale, e.target.value));
            this.#updateStyles();
        })

        const scaleSliderLabel = document.createElement("label");
        scaleSliderLabel.setAttribute('id', 'scale-range-label')
        scaleSliderLabel.setAttribute('for', 'scale-range')
        scaleSliderLabel.setAttribute('class', 'block mb-2 text-sm font-medium text-gray-900 dark:text-white')
        scaleSliderLabel.innerText = 'Scale range'

        const scaleSliderWrapper = document.createElement("div");
        scaleSliderWrapper.setAttribute("class", "flex flex-col p-2 text-gray-900 dark:text-white group");
        scaleSliderWrapper.appendChild(scaleSliderLabel);
        scaleSliderWrapper.appendChild(scaleSlider);

        li.appendChild(scaleSliderWrapper);
        // <label for="default-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Default range</label>
        // <input id="default-range" type="range" value="50" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">


        document.addEventListener('mousemove', (e) => {
            const info1 = document.getElementById('info1');
            if (info1) {
                info1.innerHTML = `mouse:<br/>x: ${e.clientX}<br/>y: ${e.clientY}<br/>zoom: ${this.#scale.toFixed(2)}`;
            }
            const info2 = document.getElementById('info2');
            if (info2) {
                const rect = this.#container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                info2.innerHTML = `container:<br/>x: ${rect.left}<br/>y: ${rect.top}<br/>width: ${rect.width.toFixed(2)}<br/>height: ${rect.height.toFixed(2)}<br/>centerX: ${centerX.toFixed(2)}<br/>centerY: ${centerY.toFixed(2)}`;
            }
            const info3 = document.getElementById('info3');
            if (info3) {
                const rect = this.#canvas.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                info3.innerHTML = `canvas:<br/>scale: ${this.#scale.toFixed(2)}<br/>x: ${rect.left.toFixed(2)}<br/>y: ${rect.top.toFixed(2)}<br/>width: ${rect.width}<br/>height: ${rect.height}<br/>centerX: ${centerX.toFixed(2)}<br/>centerY: ${centerY.toFixed(2)}`;
            }
        });

        const element1 = document.createElement("div");
        element1.innerText = 'el1';
        element1.classList.add('absolute');
        element1.classList.add('select-none');
        element1.classList.add('bg-gray-500');
        element1.classList.add('text-white');
        element1.classList.add('p-2');
        element1.classList.add('border');
        element1.classList.add('inline-block');
        element1.classList.add('cursor-grab');
        element1.style.transform = this.#generateTransform(0, 0);
        this.#canvas.appendChild(element1);

        const element2 = document.createElement("div");
        element2.innerText = 'el2';
        element2.classList.add('absolute');
        element2.classList.add('select-none');
        element2.classList.add('bg-gray-500');
        element2.classList.add('text-white');
        element2.classList.add('p-2');
        element2.classList.add('border');
        element2.classList.add('inline-block');
        element2.classList.add('cursor-grab');
        element2.style.transform = this.#generateTransform(50, 0);
        this.#canvas.appendChild(element2);

        const element3 = document.createElement("div");
        element3.innerText = 'el3';
        element3.classList.add('absolute');
        element3.classList.add('select-none');
        element3.classList.add('bg-gray-500');
        element3.classList.add('text-white');
        element3.classList.add('p-2');
        element3.classList.add('border');
        element3.classList.add('inline-block');
        element3.classList.add('cursor-grab');
        element3.style.transform = this.#generateTransform(100, 0);
        this.#canvas.appendChild(element3);

        const element4 = document.createElement("div");
        element4.innerText = 'el4';
        element4.classList.add('absolute');
        element4.classList.add('select-none');
        element4.classList.add('bg-gray-500');
        element4.classList.add('text-white');
        element4.classList.add('p-2');
        element4.classList.add('border');
        element4.classList.add('inline-block');
        element4.classList.add('cursor-grab');
        element4.style.transform = this.#generateTransform(150, 0);
        this.#canvas.appendChild(element4);

        // for (let x = 0; x <= this.#maxCanvasWidth / 100; x++) {
        //     for (let y = 0; y <= this.#maxCanvasHeight / 100; y++) {
        //         const el = document.createElement("div");
        //         el.innerText = `${x}:${y}`;
        //         el.classList.add('inline-block');
        //         el.classList.add('absolute');
        //         el.classList.add('top-0');
        //         el.classList.add('left-0');
        //         el.style.transform = `translate(${x * 100}px, ${y * 100}px)`;
        //         this.#canvas.appendChild(el);
        //     }
        // }

    };

}