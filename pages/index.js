import { useEffect, useRef } from "react";
import Head from "next/head";

function BlueWaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl", { premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) return;

    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float wave = sin((uv.x + u_time * 0.25) * 8.0) * 0.08;
        float swirl = cos((uv.y + u_time * 0.2) * 6.0) * 0.06;
        float curve = uv.y + wave + swirl;
        vec3 top = vec3(0.85, 0.94, 1.0);
        vec3 mid = vec3(0.42, 0.67, 0.98);
        vec3 bottom = vec3(0.12, 0.31, 0.74);
        float mixA = smoothstep(0.15, 0.75, curve);
        float mixB = smoothstep(0.35, 0.95, curve);
        vec3 color = mix(top, mid, mixA);
        color = mix(color, bottom, mixB);
        gl_FragColor = vec4(color, 0.55);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolutionLocation, width, height);
      }
    };

    let start = performance.now();
    let frameId;

    const render = (time) => {
      resize();
      const elapsed = (time - start) / 1000;
      gl.clearColor(1, 1, 1, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div className="webgl-wrap">
      <canvas ref={canvasRef} className="webgl-canvas" />
    </div>
  );
}

export default function Home() {
  const summaryIntro =
    "GenAI Solutions Architect and Full Stack Engineer with extensive experience designing and deploying over 120 production-grade AI applications and 90+ chatbots.";
  const summary =
    "GenAI Solutions Architect and Full Stack Engineer with extensive experience designing and deploying over 120 production-grade AI applications and 90+ chatbots. Expert in bridging Python/Node.js backends with LLM workflows (OpenAI, Anthropic, Gemini) and orchestrating complex automation via Agentic Workflows. Proven track record of saving organizations over 20,000 man-hours annually and driving AI adoption from 47% to 97% through scalable, secure architecture on GCP, AWS, and Vercel.";

  const expertise = [
    "GenAI Solutions Architecture",
    "Full Stack Engineering (Python / Node.js / TypeScript / Next.js / React)",
    "LLM Integrations (OpenAI, Anthropic, Gemini)",
    "Agentic Workflows & Automation",
    "Retrieval-Augmented Generation (RAG)",
    "Cloud Delivery (GCP, AWS, Vercel)",
    "Automation (n8n concepts, Zapier, Custom Agents)",
    "Salesforce (Agentforce, Admin, Dev)",
    "Secure Integrations & Compliance",
  ];

  const experiences = [
    {
      company: "Assent",
      title: "AI Solutions Architect",
      location: "Canada",
      dates: "Feb 2025 - Present",
      bullets: [
        "Designed Agentic Workflows and internal tools that saved over 20,000 man-hours in a single year.",
        "Architected a GenAI stack using Python and Node.js to integrate OpenAI, Anthropic, and Gemini models with live RAG.",
        "Achieved $1M+ in savings by automating workflows and reducing the need for headcount expansion.",
        "Drove AI adoption from 47% to 97% through secure, auditable, high-utility tools.",
        "Deployed custom MCP servers and secure integrations on GCP/AWS for compliance in a regulated environment.",
      ],
    },
    {
      company: "Sesh | Ai Solutions",
      title: "AI Solutions Architect",
      location: "Toronto, ON",
      dates: "Nov 2021 - Present",
      bullets: [
        "Designed architecture for 120+ GenAI applications and 90+ chatbots across 30+ clients, all reaching production.",
        "Built AI-ready marketing sites and landing pages using Next.js/React with chatbot and automation backends.",
        "Led a 100+ person community with tutorials and demos; speaker for Latinas in Tech and Somos Latinos in Tech Ottawa.",
        "Delivered pro bono GenAI workflows for 40+ small businesses to modernize operations.",
      ],
    },
    {
      company: "Online Business Systems",
      title: "Salesforce Consultant",
      location: "Toronto, ON",
      dates: "Jun 2024 - Nov 2024",
      bullets: [
        "Led Agentforce and Copilot configurations, defining use cases and safe data access for sales and service teams.",
        "Aligned Salesforce automation with external marketing tools (MCAE) for seamless data flow.",
      ],
    },
    {
      company: "Globalization Partners",
      title: "Salesforce Manager",
      location: "Ontario, Canada",
      dates: "Nov 2018 - Nov 2023",
      bullets: [
        'Built "GIA", an internal chatbot, and established GenAI-powered workflows for Jira ticket handling.',
        "Managed a Salesforce org with 1,000+ licenses, overseeing architecture and integrations.",
        'Utilized LLMs for "vibe coding", maintaining high code quality and governance.',
      ],
    },
  ];

  const education = [
    {
      degree: "Ingenieria en Sistemas (Systems Engineering)",
      school: "Universidad Marista de MAcrida",
      dates: "2004 - 2007",
    },
  ];

  const handleDownloadPdf = async () => {
    const element = document.getElementById("resume-root");
    if (!element) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(element, {
      scale: 1.35,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png", 0.92);
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save("Alejandro-De-La-Mora.pdf");
  };

  return (
    <>
      <Head>
        <title>Alejandro De La Mora | GenAI Solutions Architect</title>
        <meta
          name="description"
          content="GenAI Solutions Architect and Full Stack Engineer resume for Alejandro De La Mora."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="page" id="resume-root">
        <div className="decor-pill one" aria-hidden />
        <div className="decor-pill two" aria-hidden />
        <BlueWaveBackground />
        <div className="content">
          <div className="hero">
            <div className="title-group">
              <h1>Alejandro De La Mora</h1>
              <p className="role">GenAI Solutions Architect & Full Stack Engineer</p>
              <p className="tagline">{summaryIntro}</p>
              <button className="pdf-button" onClick={handleDownloadPdf}>
                ⬇ Download PDF
              </button>
              <div className="note">Exports what you see on screen (under 2 MB).</div>
            </div>
            <div className="contact-card">
              <h3>Contact</h3>
              <div className="contact-list">
                <span>Phone: +1 437 243 3693</span>
                <a href="mailto:alex@seshwithfriends.org">alex@seshwithfriends.org</a>
                <a href="https://www.linkedin.com/in/amorac/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href="http://www.eloruga.com" target="_blank" rel="noreferrer">
                  Website
                </a>
                <a href="https://github.com/Oruga420" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Professional Summary</h2>
            <div className="summary">{summary}</div>
          </div>

          <div className="section">
            <h2>Areas of Expertise</h2>
            <div className="badge-row">
              {expertise.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Work Experience</h2>
            <div className="experience">
              {experiences.map((job) => (
                <div key={job.company} className="card">
                  <div className="card-header">
                    <h3>
                      {job.title} @ {job.company}
                    </h3>
                    <span className="meta">
                      {job.location} · {job.dates}
                    </span>
                  </div>
                  <ul>
                    {job.bullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Education</h2>
            <div className="education-grid">
              {education.map((edu) => (
                <div key={edu.degree} className="card">
                  <div className="edu-title">{edu.degree}</div>
                  <div className="meta">
                    {edu.school} · {edu.dates}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
