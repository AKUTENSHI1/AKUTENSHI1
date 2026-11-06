# Swapping in real photos

The Top 5 video currently uses drawn stand-in pictures. These real photos are free to use
(checked on Wikimedia Commons). Most need a **credit line in your YouTube description**,
which is given below, ready to paste.

## 1. Download

Open each link, click **Download** (choose a large size, about 2000 px wide is plenty),
and save it into the `public/images/` folder with the name shown.

| Save as | Photo page | License |
|---|---|---|
| `hook.jpg` | https://commons.wikimedia.org/wiki/File:Everest,_Nuptse,_Khumbu_Glacier,_Nepal,_Himalayas.jpg | CC BY 4.0 |
| `makalu.jpg` | https://commons.wikimedia.org/wiki/File:Makalu_from_Island_Peak.jpg | CC BY 2.0 |
| `lhotse.jpg` | https://commons.wikimedia.org/wiki/File:ISS066-E-86225_-_View_of_Earth_-_Mount_Everest_-_Lhotse_-_Lhotse_Shar_-_Imja_Tse_-_lake_Imja_Tsho_(cropped).jpg | Public domain (NASA) |
| `kangchenjunga.jpg` | https://commons.wikimedia.org/wiki/File:The_kangchenjunga.jpg | CC BY 4.0 |
| `k2.jpg` | https://commons.wikimedia.org/wiki/File:Picture_of_K2.jpg | CC BY 2.0 |
| `everest.jpg` | https://commons.wikimedia.org/wiki/File:Everest,_Himalayas.jpg | CC BY 4.0 |

## 2. Point the video at them

In `src/top5/data.ts`, replace the image lines with:

```ts
  hookImage: "images/hook.jpg",
  hookAspect: 1.416,
  items: [
    { name: "Makalu", detail: "8,485 m", image: "images/makalu.jpg", aspect: 1.333 },
    { name: "Lhotse", detail: "8,516 m", image: "images/lhotse.jpg", aspect: 0.803 },
    { name: "Kangchenjunga", detail: "8,586 m", image: "images/kangchenjunga.jpg", aspect: 1.5 },
    { name: "K2", detail: "8,611 m", image: "images/k2.jpg", aspect: 1.504 },
    { name: "Mount Everest", detail: "8,849 m", image: "images/everest.jpg", aspect: 1.5 },
  ],
```

(`aspect` = photo width ÷ height. If you pick different photos, update it.)

## 3. Paste this in your YouTube description

```
Photos (Wikimedia Commons):
Everest & Nuptse, Everest – Vyacheslav Argenberg, CC BY 4.0
Makalu – mckaysavage, CC BY 2.0
Lhotse – NASA (public domain)
Kangchenjunga – Istiakuddin Ahmed, CC BY 4.0
K2 – Maria Ly, CC BY 2.0
Music: original track (made for this channel)
```
