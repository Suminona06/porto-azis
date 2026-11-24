-- Optional labeled [SAMPLE] seed data for initial portfolio testing
-- Replace entries directly through the /admin CMS after setting up authentication.

insert into public.site_profile (
  id,
  display_name,
  wordmark,
  role_en,
  role_id,
  location,
  hero_bio_en,
  hero_bio_id,
  statement_en,
  statement_id,
  marquee_roles,
  marquee_stack,
  circle_quote_en,
  circle_quote_id,
  favorite_tech,
  contact_url,
  social_links
)
values (
  1,
  'AZIS MUHAMAD FADLI',
  'azis',
  'IT SUPPORT, DEVOPS & CLOUD ENGINEER',
  'IT SUPPORT, DEVOPS & CLOUD ENGINEER',
  'INDONESIA',
  '[SAMPLE] Maintaining resilient endpoints, automating delivery pipelines, and running dependable cloud workloads across hybrid environments.',
  '[SAMPLE] Menjaga keandalan infrastruktur IT, mengotomasi pipeline deployment, dan mengelola sistem cloud yang stabil serta terpantau.',
  '[SAMPLE] FROM HELPDESK TRIAGE TO CONTAINER ORCHESTRATION AND CLOUD OBSERVABILITY, MY FOCUS IS KEEPING CRITICAL SYSTEMS CALM, PREDICTABLE, AND EASY TO RECOVER.',
  '[SAMPLE] DARI PENANGANAN INSIDEN HARIAN HINGGA OTOMASI CONTAINER DAN OBSERVABILITAS CLOUD, FOKUS SAYA ADALAH MEMASTIKAN SISTEM TETAP STABIL, TERUKUR, DAN MUDAH DIPULIHKAN.',
  array['IT SUPPORT', 'DEVOPS', 'CLOUD ENGINEER', 'INFRASTRUCTURE'],
  array['LINUX', 'DOCKER', 'KUBERNETES', 'TERRAFORM', 'AWS', 'GITHUB ACTIONS', 'PROMETHEUS', 'NGINX'],
  'RELIABLE SYSTEMS BEGIN WITH OBSERVABILITY AND CALM RECOVERY',
  'SISTEM YANG ANDAL DIMULAI DARI OBSERVABILITAS DAN PEMULIHAN YANG TENANG',
  '[
    {"name": "Linux", "slug": "linux"},
    {"name": "Docker", "slug": "docker"},
    {"name": "Kubernetes", "slug": "kubernetes"},
    {"name": "Terraform", "slug": "terraform"},
    {"name": "AWS", "slug": "aws"}
  ]'::jsonb,
  'mailto:azis.placeholder@example.com',
  '[
    {"label": "LINKEDIN", "url": "https://linkedin.com/in/azisfadli-placeholder"},
    {"label": "GITHUB", "url": "https://github.com/azisfadli-placeholder"},
    {"label": "INSTAGRAM", "url": "https://instagram.com/azisfadli-placeholder"},
    {"label": "THREADS", "url": "https://threads.net/@azisfadli-placeholder"}
  ]'::jsonb
)
on conflict (id) do nothing;

insert into public.about_sections (
  id,
  headline_en,
  headline_id,
  profile_image_url,
  journey_en,
  journey_id,
  philosophy_en,
  philosophy_id,
  interest_en,
  interest_id,
  interest_image_url
)
values (
  1,
  E'AZIS MUHAMAD FADLI\nCLOUD & DEVOPS ENGINEER',
  E'AZIS MUHAMAD FADLI\nCLOUD & DEVOPS ENGINEER',
  '',
  E'Starting on the frontline of IT Support taught me how real people experience infrastructure failures. Every slow VPN tunnel, misconfigured DNS record, or unresponsive workstation was a lesson in calm triage and root-cause isolation.\n\nOver time, resolving recurring tickets evolved into building automation. I began replacing manual fixes with repeatable Bash and Python scripts, containerized internal services with Docker, and CI/CD pipelines that keep deployments predictable.\n\nToday, my focus bridges systems reliability and cloud engineering, from provisioning reproducible Linux workloads with Terraform and AWS to instrumenting Prometheus and Grafana observability so teams can recover fast and ship with confidence.',
  E'Memulai karier di garis depan IT Support mengajarkan saya bagaimana gangguan infrastruktur berdampak langsung pada pekerjaan pengguna. Setiap kendala VPN, kesalahan DNS, atau perangkat kerja yang bermasalah menjadi latihan triase yang tenang dan isolasi akar masalah.\n\nSeiring waktu, penyelesaian tiket berulang berkembang menjadi upaya otomasi. Saya mulai mengganti perbaikan manual dengan skrip Bash dan Python yang terstandar, kontainerisasi layanan internal dengan Docker, serta pipeline CI/CD agar deployment tetap terprediksi.\n\nKini fokus saya menjembatani keandalan sistem dan rekayasa cloud, mulai dari penyediaan beban kerja Linux yang reprodusibel menggunakan Terraform dan AWS hingga observabilitas Prometheus dan Grafana agar tim dapat pulih cepat dan merilis dengan tenang.',
  'I build resilient systems where clear runbooks, versioned infrastructure, and honest monitoring turn complex operations into calm, repeatable engineering.',
  'Saya merancang sistem yang tangguh, di mana runbook yang jelas, infrastruktur terkontrol versi, dan monitoring yang jujur mengubah operasi kompleks menjadi proses yang tenang dan terprediksi.',
  '[SAMPLE] Outside daily operations, I document homelab experiments with Proxmox, self-hosted backups, network segmentation, and post-incident notes to share practical troubleshooting paths.',
  '[SAMPLE] Di luar pekerjaan operasional, saya mendokumentasikan eksperimen homelab dengan Proxmox, sistem backup mandiri, segmentasi jaringan, serta catatan pasca-insiden sebagai referensi praktis.',
  ''
)
on conflict (id) do nothing;

insert into public.skill_groups (id, title_en, title_id, items, sort_order)
values
  (
    '11111111-1111-4111-8111-111111111101',
    'IT Support & Systems Administration',
    'IT Support & Administrasi Sistem',
    array['Linux & Windows Troubleshooting', 'Active Directory & IAM', 'DNS / DHCP / VPN Diagnostics', 'Endpoint Hardening', 'Asset & Incident Documentation'],
    1
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'DevOps & Automation',
    'DevOps & Otomasi',
    array['Docker & Docker Compose', 'GitHub Actions CI/CD', 'Bash & Python Scripting', 'Nginx Reverse Proxy', 'Zero-Downtime Rollouts'],
    2
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Cloud Infrastructure & Orchestration',
    'Infrastruktur Cloud & Orkestrasi',
    array['AWS EC2 / S3 / VPC / IAM', 'Terraform Infrastructure as Code', 'Kubernetes Workloads', 'Cloudflare DNS & TLS', 'Automated Snapshot Backups'],
    3
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'Observability & Security',
    'Observabilitas & Keamanan',
    array['Prometheus & Grafana', 'Log Aggregation', 'SSL / TLS Automation', 'Least-Privilege Access Reviews', 'Post-Incident Runbooks'],
    4
  )
on conflict (id) do nothing;

insert into public.activities (
  id,
  title_en,
  title_id,
  subtitle_en,
  subtitle_id,
  description_en,
  description_id,
  category,
  location,
  year,
  image_url,
  sort_order
)
values
  (
    '22222222-2222-4222-8222-222222222201',
    '[SAMPLE] Cloud Infrastructure & DevOps Operations',
    '[SAMPLE] Operasional Cloud Infrastructure & DevOps',
    'CONTAINERIZATION & CI/CD WORKFLOWS',
    'KONTENERISASI & ALUR CI/CD',
    '[SAMPLE] Standardized staging and production deployments with Docker, automated health checks, and documented rollback playbooks.',
    '[SAMPLE] Menstandarkan deployment staging dan produksi menggunakan Docker, pemeriksaan kesehatan otomatis, dan panduan rollback.',
    'WORK',
    'Jakarta, Indonesia',
    '2025',
    '',
    1
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '[SAMPLE] IT Support & Network Reliability Desk',
    '[SAMPLE] IT Support & Keandalan Jaringan',
    'WORKSTATION & INTERNAL INFRASTRUCTURE',
    'PERANGKAT KERJA & JARINGAN INTERNAL',
    '[SAMPLE] Handled hardware provisioning, VPN onboarding, ticket triage, and clear SOP guides for hybrid teams.',
    '[SAMPLE] Menangani pengadaan perangkat, konfigurasi VPN, triase tiket, dan penyusunan SOP kerja untuk tim hybrid.',
    'SUPPORT',
    'Bandung, Indonesia',
    '2024',
    '',
    2
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '[SAMPLE] Homelab & Self-Hosted Telemetry Lab',
    '[SAMPLE] Homelab & Eksperimen Telemetri Mandiri',
    'PROXMOX + PROMETHEUS + GRAFANA',
    'PROXMOX + PROMETHEUS + GRAFANA',
    '[SAMPLE] Built an isolated lab environment to test VM backups, firewall rules, and alert routing before production rollouts.',
    '[SAMPLE] Membangun lingkungan lab terisolasi untuk menguji backup VM, aturan firewall, dan notifikasi peringatan.',
    'LAB',
    'Indonesia',
    '2023',
    '',
    3
  )
on conflict (id) do nothing;

insert into public.projects (
  id,
  title,
  tech_stack,
  external_url,
  banner_url,
  year,
  featured_on_home,
  sort_order
)
values
  (
    '33333333-3333-4333-8333-333333333301',
    'Docker Observability Stack',
    array['DOCKER', 'PROMETHEUS', 'GRAFANA', 'NGINX'],
    'https://github.com/azisfadli-placeholder/observability-stack',
    '',
    '2025',
    true,
    1
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    'AWS VPC Terraform Blueprint',
    array['TERRAFORM', 'AWS', 'IAM', 'VPC'],
    'https://github.com/azisfadli-placeholder/aws-vpc-blueprint',
    '',
    '2025',
    true,
    2
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    'Self-Hosted CI/CD Runner',
    array['GITHUB ACTIONS', 'LINUX', 'SYSTEMD', 'CADDY'],
    'https://github.com/azisfadli-placeholder/actions-runner-setup',
    '',
    '2024',
    true,
    3
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    'Workstation Audit & Setup CLI',
    array['BASH', 'POWERSHELL', 'SSH', 'WIREGUARD'],
    'https://github.com/azisfadli-placeholder/support-audit-cli',
    '',
    '2024',
    true,
    4
  ),
  (
    '33333333-3333-4333-8333-333333333305',
    'PostgreSQL Backup Pipeline',
    array['POSTGRESQL', 'S3', 'CRON', 'ENCRYPTION'],
    'https://github.com/azisfadli-placeholder/pg-backup-pipeline',
    '',
    '2023',
    false,
    5
  )
on conflict (id) do nothing;

insert into public.posts (
  id,
  slug,
  title,
  excerpt,
  content_markdown,
  category,
  language,
  translation_group_id,
  cover_image_url,
  reading_minutes,
  published,
  published_at
)
values
  (
    '44444444-4444-4444-8444-444444444401',
    'checklist-troubleshooting-linux-server-down',
    '[SAMPLE] Checklist Cepat Saat Linux Server Tiba-Tiba Unreachable',
    'Urutan pemeriksaan 5 menit dari lapisan jaringan, disk penuh, hingga konsumsi memori untuk insiden server produksi.',
    E'## Mengapa Urutan Pemeriksaan Itu Penting\n\nSaat server produksi tidak bisa dijangkau lewat HTTP maupun SSH, kepanikan sering membuat engineer langsung melakukan reboot sebelum mengumpulkan jejak akar masalah.\n\nChecklist singkat berikut membantu memastikan kita memeriksa gejala dari luar ke dalam secara runtut.\n\n## 1. Verifikasi Jangkauan Jaringan & DNS\n\nMulai dari memeriksa apakah nama domain masih mengarah ke IP yang benar dan apakah port layanan terbuka.\n\n```bash\ndig +short app.example.com\nnc -zv 203.0.113.10 443\nss -tulpn | grep -E ":(80|443|22)"\n```\n\n## 2. Periksa Kapasitas Disk & Inode\n\nLog aplikasi atau container yang tidak dirotasi dapat menghabiskan ruang disk hingga 100% dan membuat proses autentikasi maupun database gagal menulis.\n\n```bash\ndf -h\ndf -i\ndu -sh /var/log/* | sort -hr | head -n 10\n```\n\n| Gejala | Perintah Cek | Tindakan Aman Pertama |\n| --- | --- | --- |\n| Disk `/var` penuh | `df -h` | Bersihkan log lama atau container dangling |\n| Inode habis | `df -i` | Cari direktori dengan jutaan file kecil |\n| OOM Killer aktif | `dmesg -T | grep -i oom` | Batasi memori container dan cek memory leak |\n\n## 3. Dokumentasikan Sebelum Reboot\n\n> Simpan output `journalctl -xeu <service>` sebelum restart layanan agar investigasi pasca-insiden memiliki bukti yang utuh.\n',
    'Troubleshooting',
    'id',
    '55555555-5555-4555-8555-555555555501',
    '',
    4,
    true,
    '2025-11-10T09:00:00Z'
  ),
  (
    '44444444-4444-4444-8444-444444444402',
    'zero-downtime-docker-compose-healthcheck',
    '[SAMPLE] Structuring Zero-Downtime Container Updates on Single-VM Hosts',
    'Practical healthcheck, reverse proxy upstream timeout, and rollback patterns when running small workloads without full Kubernetes.',
    E'## When Single-VM Simplicity Fits Best\n\nNot every internal tool needs a multi-node Kubernetes cluster on day one. On a well-sized Linux VM, predictable healthchecks and reverse proxy timeouts eliminate cold drops during deployments.\n\n## Explicit Container Healthchecks\n\nDeclare an explicit `healthcheck` so orchestration tools and deploy scripts wait until the runtime actually serves HTTP 200 instead of checking PID startup alone.\n\n```yaml\nservices:\n  web:\n    image: ghcr.io/example/service:1.4.2\n    restart: unless-stopped\n    healthcheck:\n      test: ["CMD", "curl", "-fsS", "http://127.0.0.1:8080/health"]\n      interval: 15s\n      timeout: 3s\n      retries: 3\n      start_period: 20s\n```\n\n## Keep Rollbacks Boring\n\n1. Always tag images with the Git commit SHA rather than relying exclusively on `latest`.\n2. Verify health endpoints locally before shifting proxy traffic.\n3. Keep the previous image cached locally for fast fallback.\n',
    'DevOps',
    'en',
    '55555555-5555-4555-8555-555555555501',
    '',
    3,
    true,
    '2025-10-28T09:00:00Z'
  ),
  (
    '44444444-4444-4444-8444-444444444403',
    'catatan-desain-vpc-aws-sederhana-aman',
    '[SAMPLE] Catatan Merancang Subnet Publik dan Privat di AWS VPC',
    'Pemisahan trafik ingress dan beban kerja backend agar database serta VM internal tidak terekspos langsung ke internet.',
    E'## Prinsip Dasar Pemisahan Subnet\n\nMemisahkan Load Balancer atau Bastion di subnet publik dan memindahkan aplikasi beserta database ke subnet privat secara drastis memperkecil permukaan serangan.\n\n## Aturan Security Group Minimal\n\n- Izinkan port `80` dan `443` hanya pada Application Load Balancer.\n- Referensikan ID Security Group milik ALB di Security Group instance aplikasi, bukan CIDR `0.0.0.0/0`.\n- Gunakan AWS SSM Session Manager atau Bastion terotentikasi untuk akses shell.\n\n```hcl\nresource "aws_security_group_rule" "app_from_alb" {\n  type                     = "ingress"\n  from_port                = 8080\n  to_port                  = 8080\n  protocol                 = "tcp"\n  security_group_id        = aws_security_group.app.id\n  source_security_group_id = aws_security_group.alb.id\n}\n```\n',
    'Cloud',
    'id',
    null,
    '',
    3,
    true,
    '2025-10-12T09:00:00Z'
  )
on conflict (slug) do nothing;

