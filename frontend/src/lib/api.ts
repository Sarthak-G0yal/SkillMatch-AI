export async function uploadResume(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("http://localhost:8000/upload_resume", {
    method: "POST",
    body: form,
  });
  return res.json();
}

export async function matchJobDescription(description: string) {
  const form = new FormData();
  form.append("job_description", description);
  const res = await fetch("http://localhost:8000/match", {
    method: "POST",
    body: form,
  });
  return res.json();
}
