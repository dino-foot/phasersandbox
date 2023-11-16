import { GameObjects, Scene } from "phaser";
import { PhaserHelpers, moneyWinEffects, tweenPosition } from "../helpers";
import { TextSettings } from "../settings/TextSettings";

export class FortuneWheelScene extends Scene {
    wheelSettings = {
        slices: 12,
        sliceColors: [0xffd28f, 0xa2c579, 0xd2de32, 0x61a3ba, 0x83a2ff, 0xff6c22, 0xe9b824, 0xb4bdff, 0xff4b91, 0xff7676, 0xffcd4b, 0x22a699],
        slicePrizes: [10, 2, 1, 3, 20, 5, 100, 4, 5, 1, 2, 5],
        rotationTime: 3000,
        wheelRadius: 300,
    };
    wheel: GameObjects.Sprite;
    wheelContainer: GameObjects.Container;
    isSpinning: boolean;
    winText: GameObjects.Text;
    winAmount = 0;
    constructor() {
        super("fortune-wheel");
    }

    init() {
        console.log("fortune-wheel");
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.winAmount = 0;
        this.add
            .image(centerX, centerY + 250, "bg")
            .setOrigin(0.5)
            .setOrigin(0.5)
            .setScale(3);
        this.winText = PhaserHelpers.addText(TextSettings.WIN, this);
    }

    create() {
        this.createWheel();
    }

    createWheel() {
        const sliceDegrees = 360 / this.wheelSettings.slices;
        const graphics = this.make.graphics({ x: 0, y: 0 }, false);
        this.wheelContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);

        // const graphics = this.add.graphics();

        for (let i = 0; i < this.wheelSettings.slices; i++) {
            graphics.lineStyle(4, 0xffffff);
            // setting graphics fill style
            graphics.fillStyle(this.wheelSettings.sliceColors[i], 1);
            // drawing the slice
            graphics.slice(
                this.wheelSettings.wheelRadius,
                this.wheelSettings.wheelRadius,
                this.wheelSettings.wheelRadius,
                Phaser.Math.DegToRad(270 + i * sliceDegrees),
                Phaser.Math.DegToRad(270 + (i + 1) * sliceDegrees),
                false
            );

            // filling the slice
            graphics.fillPath();
            graphics.strokePath();
            graphics.closePath();
        }

        graphics.generateTexture("wheel", this.wheelSettings.wheelRadius * 2, this.wheelSettings.wheelRadius * 2);
        this.wheel = this.add.sprite(0, 0, "wheel");
        this.wheelContainer.add(this.wheel);

        const anglePerSlice = (2 * Math.PI) / this.wheelSettings.slices;
        const textList = [];
        for (let i = 0; i < this.wheelSettings.slicePrizes.length; i++) {
            const angle = i * anglePerSlice + anglePerSlice / 2;
            const x = this.wheel.x + Math.cos(angle) * (this.wheelSettings.wheelRadius - 50);
            const y = this.wheel.y + Math.sin(angle) * (this.wheelSettings.wheelRadius - 50);
            // console.log('angle ', angle)
            const text = this.add.text(x, y, `${this.wheelSettings.slicePrizes[i]}$`, { fontSize: "34px" }).setDepth(1);
            text.setRotation(angle + Math.PI / 2);
            text.setOrigin(0.5);
            textList.push(text);
        }
        this.wheelContainer.add(textList);

        const pin = this.add
            .image(this.wheelContainer.x, this.wheelContainer.y - this.wheelContainer.y / 1.75, "pin")
            .setOrigin(0.5)
            .setDepth(3);
        pin.setScale(1.5);

        this.input.on("pointerdown", this.spinWheel, this);
    }

    // https://labs.phaser.io/edit.html?src=src\game%20objects\rope\single%20alpha%20rope.js
    spinWheel() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        const rounds = Phaser.Math.Between(2, 8);
        const degrees = Phaser.Math.Between(0, 360);

        this.tweens.add({
            targets: this.wheelContainer,
            angle: 360 * rounds + degrees,
            duration: this.wheelSettings.rotationTime,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => {
                this.isSpinning = false;
                const emitter = moneyWinEffects(this, { x: this.wheelContainer.x - 20, y: this.wheelContainer.y - 20 });
                tweenPosition(this, emitter, { x: this.winText.x, y: this.winText.y }, { scale: 0, alpha: 0, duration: 1000, delay: 1600 });

                let prizeIndex = this.getPrize(degrees);
                if (prizeIndex > 3) prizeIndex -= 3;

                this.winAmount += this.wheelSettings.slicePrizes[prizeIndex];
                this.winText.setText(`WIN: ${this.winAmount}$`);
                
                console.log(`index ${prizeIndex} prize ${this.wheelSettings.slicePrizes[prizeIndex]}$`);
            },
        });
    }

    getPrize(degrees: number) {
        const prizeIndex = this.wheelSettings.slices - 1 - Math.floor(degrees / (360 / this.wheelSettings.slices));
        return prizeIndex;
    }
}