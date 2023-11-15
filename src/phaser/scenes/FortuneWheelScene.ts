import { GameObjects, Scene } from "phaser";
import { PhaserHelpers, moneyWinEffects, tweenPosition } from "../helpers";
import { TextSettings } from "../settings/TextSettings";

export class FortuneWheelScene extends Scene {
    wheelSettings = {
        slices: 12,
        sliceColors: [
            0xFFD28F,
            0xA2C579,
            0xD2DE32,
            0x61A3BA,
            0x83A2FF,
            0xFF6C22,
            0xE9B824,
            0xB4BDFF,
            0xFF4B91,
            0xFF7676,
            0xFFCD4B,
            0x22A699,
        ],
        slicePrizes: [
            "10$",
            "2$",
            "1$",
            "3$",
            "20$",
            "5$",
            "100$",
            "4$",
            "5$",
            "1$",
            "2$",
            "5$"
        ],
        rotationTime: 3000,
        wheelRadius: 300
    };
    wheel: GameObjects.Sprite
    isSpinning: boolean
    winText: GameObjects.Text;
    winAmount = 0;
    constructor() {
        super('fortune-wheel');
    }

    init() {
        console.log('fortune-wheel');
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.winAmount = 0;
        this.add.image(centerX, centerY + 250, 'bg').setOrigin(0.5).setOrigin(0.5).setScale(3);
        this.winText = PhaserHelpers.addText(TextSettings.WIN, this);
    }

    create() {
        this.createWheel();
    }

    createWheel() {
        const sliceDegrees = 360 / this.wheelSettings.slices;
        const graphics = this.make.graphics({ x: 0, y: 0 }, false);
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
        this.wheel = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "wheel");

        const anglePerSlice = (2 * Math.PI) / this.wheelSettings.slices;
        for (let i = 0; i < this.wheelSettings.slicePrizes.length; i++) {
            const angle = i * anglePerSlice + anglePerSlice / 2;
            const x = this.wheel.x + Math.cos(angle) * (this.wheelSettings.wheelRadius - 50);
            const y = this.wheel.y + Math.sin(angle) * (this.wheelSettings.wheelRadius - 50);
            // console.log('angle ', angle)

            const text = this.add.text(x, y, this.wheelSettings.slicePrizes[i], { fontSize: '34px' }).setDepth(1);
            text.setRotation(angle + Math.PI / 2);
            text.setOrigin(0.5);
        }

        const pin = this.add.image(this.wheel.x, this.wheel.y - this.wheel.y / 1.75, 'pin').setOrigin(0.5).setDepth(3);
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
            targets: this.wheel,
            angle: 360 * rounds + degrees,
            duration: this.wheelSettings.rotationTime,
            ease: Phaser.Math.Easing.Sine.InOut,
            onComplete: () => {
                this.isSpinning = false;
                const emitter = moneyWinEffects(this, { x: this.wheel.x, y: this.wheel.y });
                tweenPosition(this, emitter, { x: this.winText.x, y: this.winText.y }, { scale: 0, alpha: 0, duration: 1000, delay: 1600 });
                this.winAmount += 10;
                this.winText.setText(`WIN: ${this.winAmount}$`);
            }
        });

    }
}