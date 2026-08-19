"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState("loading"); // loading, ready, error

  // GANTI URL DI BAWAH INI
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxluaJjQ1bgB_2Oxbfho4ljJi9M0ATU5IVc4RjYsVDgLnAKYX53Ff5cHDv5yuDV_Upp/exec";

  useEffect(() => {
    if (!id) {
      setStatus("error");
      return;
    }

    fetch(`${SCRIPT_URL}?action=get_product&product_id=${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          if (res.data.status === "activated") {
            window.location.replace(res.data.google_review_url);
          } else {
            setData(res.data);
            setStatus("ready");
          }
        } else {
          setStatus("error");
        }
      });
  }, [id]);

  if (status === "loading") return <div style={{padding: '20px'}}>Memuat data...</div>;
  if (status === "error") return <div style={{padding: '20px', color: 'red'}}>Product ID tidak ditemukan atau tidak valid.</div>;

  return (
    <div style={{padding: '20px', maxWidth: '400px', margin: '0 auto'}}>
      <h1>Aktivasi Kartu: {id}</h1>
      <input id="url" placeholder="Masukkan Link Google Review" style={{width: '100%', padding: '10px', margin: '10px 0'}} />
      <button onClick={() => {
        const url = (document.getElementById("url") as HTMLInputElement).value;
        if(!url) return alert("Masukkan URL!");
        fetch(SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify({ action: "activate", product_id: id, google_review_url: url })
        }).then(() => window.location.replace(url));
      }} style={{width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px'}}>
        Aktifkan Kartu
      </button>
    </div>
  );
}
