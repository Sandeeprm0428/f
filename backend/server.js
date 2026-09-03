const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const DATA_FILE = path.join(__dirname, "..", "frontend", "myapp", "src", "data", "advocates.json");
const IMAGE_DIR = path.join(__dirname, "..", "frontend", "myapp", "public", "images");

function send(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  response.end(JSON.stringify(body));
}

function saveAvatar(advocate) {
  if (!String(advocate.avatarData || "").startsWith("data:image/")) {
    return advocate.avatar || "";
  }

  const match = String(advocate.avatarData).match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!match) throw new Error("Unsupported avatar image format");

  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  const slug = String(advocate.name || "advocate")
    .replace(/^adv\.\s*/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "advocate";
  const filename = `${slug}.${extension}`;

  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGE_DIR, filename), Buffer.from(match[2], "base64"));
  return `/images/${filename}`;
}

function saveAvatarUpload(payload) {
  const avatar = saveAvatar({ name: payload.name, avatarData: payload.avatarData });
  if (!avatar) throw new Error("Profile image is required");
  return avatar;
}

function appendApprovedAdvocate(advocate) {
  const advocates = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const email = String(advocate.email || "").trim().toLowerCase();

  if (!email) throw new Error("Advocate email is required");
  if (advocates.some((item) => String(item.email).toLowerCase() === email)) {
    return advocates.find((item) => String(item.email).toLowerCase() === email);
  }

  const nextId = advocates.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  const record = {
    id: nextId,
    name: advocate.name || "",
    city: advocate.city || "",
    practiceArea: advocate.practiceArea || advocate.speciality || "",
    speciality: advocate.speciality || "",
    experience: advocate.experience || "",
    rating: Number(advocate.rating) || 0,
    cases: Number(advocate.cases) || 0,
    fee: advocate.fee || "Not specified",
    phone: advocate.phone || "",
    email,
    password: advocate.password || "",
    languages: Array.isArray(advocate.languages) ? advocate.languages : [],
    availability: advocate.availability || "Not available",
    bio: advocate.bio || "",
    avatar: saveAvatar(advocate),
  };

  advocates.push(record);
  advocates.sort((left, right) => left.id - right.id);
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(advocates, null, 2)}\n`, "utf8");
  return record;
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    send(response, 204, {});
    return;
  }

  if (request.method !== "POST" || !["/api/advocates/avatar", "/api/advocates/approved"].includes(request.url)) {
    send(response, 404, { error: "Not found" });
    return;
  }

  let body = "";
  request.on("data", (chunk) => { body += chunk; });
  request.on("end", () => {
    try {
      const payload = JSON.parse(body);
      const saved = request.url === "/api/advocates/avatar"
        ? { avatar: saveAvatarUpload(payload) }
        : appendApprovedAdvocate(payload);
      send(response, 200, saved);
    } catch (error) {
      send(response, 400, { error: error.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`AdvocateHub API running at http://localhost:${PORT}`);
});
