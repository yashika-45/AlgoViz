# 📊 AlgoViz – Operating System Algorithms Visualizer

**AlgoViz** is an interactive web-based visualizer for **Disk Scheduling** and **Page Replacement** algorithms. Designed for students, educators, and OS enthusiasts, it offers a sleek, modern UI with real-time animations and performance insights to aid understanding of core operating system concepts.

![AlgoViz Banner](./assets/algoviz.png) <!-- Optional: Replace with your actual image -->

---

## 🚀 Live Demo

[🔗 Try AlgoViz Live](https://disk-visualizer.vercel.app/)

---

## 📌 Features

### 🔄 Disk Scheduling Algorithms
- FCFS (First-Come First-Serve)
- SSTF (Shortest Seek Time First)
- SCAN, C-SCAN
- LOOK, C-LOOK
- Visual animation of disk head movement
- Seek time calculation and chart comparison

### 🧠 Page Replacement Algorithms
- FIFO (First-In-First-Out)
- LRU (Least Recently Used)
- Optimal (Theoretical Best)
- Clock Algorithm
- Visual simulation of page hits and faults

### 🎨 UI & Experience
- Responsive, modern dark-themed interface
- Adjustable animation speed
- Explanation and theory sections
- Downloadable PDF content

---

## 🛠️ Tech Stack

| Layer       | Tools & Libraries                          |
|-------------|---------------------------------------------|
| Frontend    | React, React Router                        |
| Visualization | Chart.js, React-Chartjs-2               |
| PDF Export  | html2canvas, jsPDF                         |
| Styling     | Tailwind CSS, Custom CSS                   |

---

## 📸 Screenshots

| Disk Scheduling              | Page Replacement             |
|-----------------------------|------------------------------|
| ![disk](./assets/disk.png)  | ![page](./assets/page.png)   |

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/yourusername/algoviz.git
cd algoviz

# Install dependencies
npm install

# Start the development server
npm start

## 📁 Project Structure


---

## 📄 Learn Section

AlgoViz includes a built-in **Learn** tab that offers:

- 📘 Algorithm descriptions and principles  
- 🧠 Use-cases and comparisons  
- 📊 Helpful visuals and breakdowns  
- 📥 Downloadable PDF for revision  

---

## ✅ To-Do

- [ ] Add CPU Scheduling algorithms  
- [ ] Improve responsiveness on small screens  
- [ ] Add keyboard controls and accessibility  
- [ ] Multi-language support  

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature-name

# Make your changes
# Commit
git commit -m "feat: added feature"

# Push and create a pull request
git push origin feature-name
