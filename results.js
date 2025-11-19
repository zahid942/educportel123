// routes/results.js
const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer-core");
const chromium = require('@sparticuz/chromium');
// In-memory cache
const cache = new Map();
const TTL = 10 * 60 * 1000; // 10 minutes

// Clean old cache
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of cache) {
    if (now - val.timestamp > TTL) cache.delete(key);
  }
}, 60_000);

// Generic browser launcher
const launchBrowser = async () => {
  return await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
    defaultViewport: null,
  });
};

// Generic text extractor
const extractText = (rows, label) => {
  const row = rows.find(r => r.textContent.includes(label));
  return row ? row.cells[1]?.innerText.trim() : null;
};

// ---------- PU ----------
async function scrapePU(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.pu.edu.pk/result/?roll=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Registration");

      const subjectRows = Array.from(document.querySelectorAll("table.result-table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA") || extractText(rows, "SGPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- BZU ----------
async function scrapeBZU(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.bzu.edu.pk/results.php?rollno=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Reg No");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- UOS ----------
async function scrapeUOS(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.uos.edu.pk/Results/result.php?rollno=${rollno}&exam=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Registration");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- UOG ----------
async function scrapeUOG(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.uog.edu.pk/Examination/Results/result.php?roll=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Student Name");
      const father = extractText(rows, "Father Name");
      const reg = extractText(rows, "Reg No");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- GCUF ----------
async function scrapeGCUF(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.gcuf.edu.pk/examination/results/result.php?rollno=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Registration No");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- IUB ----------
async function scrapeIUB(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.iub.edu.pk/results/result.php?rollno=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Reg No");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- UO ----------
async function scrapeUO(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.uo.edu.pk/results/result.php?roll=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Reg No");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- UE ----------
async function scrapeUE(rollno, year, semester) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const url = `https://www.ue.edu.pk/Examination/Results/result.php?rollno=${rollno}&year=${year}&sem=${semester}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));

      const name = extractText(rows, "Name");
      const father = extractText(rows, "Father");
      const reg = extractText(rows, "Registration");

      const subjectRows = Array.from(document.querySelectorAll("table tr")).slice(1);
      const subjects = subjectRows.map(tr => {
        const td = tr.querySelectorAll("td");
        if (td.length < 7) return null;
        return {
          code: td[0].innerText.trim(),
          name: td[1].innerText.trim(),
          creditHours: parseInt(td[2].innerText) || 3,
          marksObtained: parseInt(td[3].innerText) || 0,
          totalMarks: parseInt(td[4].innerText) || 100,
          grade: td[5].innerText.trim(),
          gradePoints: parseFloat(td[6].innerText) || 0,
        };
      }).filter(Boolean);

      const gpa = extractText(rows, "GPA");
      const cgpa = extractText(rows, "CGPA");

      return { name, father, reg, subjects, gpa, cgpa };
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// ---------- ROUTE ----------
router.post("/university", async (req, res) => {
  const { university, rollno, examYear, semester } = req.body;

  if (!university || !rollno || !examYear || !semester) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const key = `${university.toLowerCase()}-${rollno}-${examYear}-${semester}`;
  if (cache.has(key)) {
    return res.json({ success: true, data: cache.get(key).data, source: "Cache" });
  }

  try {
    let scraped;
    const uni = university.toLowerCase();

    switch (uni) {
      case "pu":   scraped = await scrapePU(rollno, examYear, semester);   break;
      case "bzu":  scraped = await scrapeBZU(rollno, examYear, semester);  break;
      case "uos":  scraped = await scrapeUOS(rollno, examYear, semester);  break;
      case "uog":  scraped = await scrapeUOG(rollno, examYear, semester);  break;
      case "gcuf": scraped = await scrapeGCUF(rollno, examYear, semester); break;
      case "iub":  scraped = await scrapeIUB(rollno, examYear, semester);  break;
      case "uo":   scraped = await scrapeUO(rollno, examYear, semester);   break;
      case "ue":   scraped = await scrapeUE(rollno, examYear, semester);   break;
      default:
        return res.status(400).json({ success: false, message: "University not supported" });
    }

    const totalCredits = scraped.subjects.reduce((s, r) => s + r.creditHours, 0);
    const status = parseFloat(scraped.gpa || 0) >= 2.0 ? "Pass" : "Fail";

    const result = {
      university: getFullName(uni),
      program: "BS Program",
      semester,
      examYear,
      rollno,
      studentName: scraped.name || "Not Found",
      fatherName: scraped.father || "Not Found",
      registrationNo: scraped.reg || "N/A",
      subjects: scraped.subjects,
      gpa: scraped.gpa || "0.00",
      cgpa: scraped.cgpa || "0.00",
      totalCredits,
      status,
      issueDate: new Date().toLocaleDateString("en-GB"),
      fetchTime: new Date().toLocaleTimeString(),
      source: "Live University Website",
    };

    cache.set(key, { data: result, timestamp: Date.now() });
    res.json({ success: true, data: result });

  } catch (err) {
    console.error(`Scrape failed for ${university}:`, err.message);
    res.status(404).json({ success: false, message: "Result not found or server error" });
  }
});

// University full name
function getFullName(code) {
  const map = {
    pu: "University of the Punjab",
    bzu: "Bahauddin Zakariya University",
    uos: "University of Sargodha",
    uog: "University of Gujrat",
    gcuf: "Government College University Faisalabad",
    iub: "The Islamia University of Bahawalpur",
    uo: "University of Okara",
    ue: "University of Education",
  };
  return map[code] || code.toUpperCase();
}


module.exports = router;
