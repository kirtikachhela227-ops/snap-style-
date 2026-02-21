
import React from 'react';

const Moodboard: React.FC = () => {
  const items = [
    { type: 'Saved Outfit', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1VlRwRASJU_syd9ADD_vNc5bvMPs1-5Jp9TMahrA2T0xQt_mfGR3S66PpF3HnHs2yekdhSJAeGx2Jk0XDhi0I6UOn7I_YNRb_96M0M3LDS5DKxaBDXxDdoGTXM96_7KhXSSIWATk6Tafx2gMGyB3yEW0GSkmlsRT833xdSv1qpCrq_ZcS2CFfiYYcGX3NVLM5HPvTFTaVBBxy8ea4G6Musjyyg30Ywq1L2ozl8oPmIwI7BDKs-JL7u_x5dAnxVz0lDs9nYMtgxZU', title: 'The Mustard Essential' },
    { type: 'AI Suggested', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGeEm8AL21Zloo6Ubltl_yJDSAD03V_dPm71SAMEKxFEqRZdoamskZqoq5wxNjx8pMruKLnJLlNp5iJy64_qhugW5440S00lth9OBL7xWEC30THFv3ECW6TrWHmO6q1TrsyC_fn9GqY7KVA8-VVFe5jUCaKVD3QZd8TGc_INBC2rLrhRAT_ZFiGlDQ4a5sqpI0IsPZHMd2K5Q0sCYVu7PedKAYwf6OMxHPmtdW8JEiP-T9MUaK5L9ASTt4wLkWCfOMYrw5c5yPA8', title: 'Velvet Minimalism' },
    { type: 'Material', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBdzYDsCbvJ_PbckBNKo4k6j2NANodqbadsE0l7f-9nAbJxpLP_vmzvzEYEXZ4M-Abo7uSVPlHe61QF8rCtTpjTr24jWJ0OJEiNkYO_LzwAylIhoR5OMNYSV_XcbxJouMEaNbOXU65R6LjGLHpXNHmTZoLRLYGyzonejm56FF5ry6GZCnFLkhCl7_e56YLAgbY6gtPp0nEvSJhmQ3xdwurPA5xoH6PXWwUR--duq-1S3JaMYpHu8_j4iK8drDBN26KekNTDGUEdVE', title: 'Texture Study' },
    { type: 'AI Suggested', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFvFNhEFH1tiOB5Lb8ECprp0MZ8HsImuTMMB4VTXMurkkCzKQGrSeP5Q1xmWW4edW8ezkBlW9SkOqNM9iU3if39zwi1yybIUhv4a-6ld1zoa6PH9f1OLojd3DrViRHiXh-a3pHesP6oRbZS9DsmMfj3N4eTSj1Zgj7JlMGtQevv8qgKRdNqMyuFEkbHS3_sEKC0Cw-9ju5C1PQffox-WtKXZWdUT-3Az6CF_BDO4LwS_pw6JaYas_Lf5nx6JzoymFRoRn2cMe3Tt4', title: 'Urban Sophistication' },
    { type: 'Saved Item', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgtbYUw3E0TxeOlYEtCYxXKfBy4aIBLlAnBH50t-TC78yO2EVgXXvdwpGVELlyh6Qv6XdrzRyzhnNDHq3UeRuN7TtuofQimIKO24BsC6nS1oaNJ1t1xlRCJEUpe8qqjcTQbnfJ6FnRoLuMYkiinRH6CYby9QcPCqPJT7UakoUmxM55ZWE0q-A_0spl7xL7klZH_iymSTzmpIU_BuTegZ6vH76WogJd3KciojTwdrftP7oJC-bhLp6tLdfQcdN5vE-RdOoH10AtYSg', title: 'Luxury Detail' },
    { type: 'AI Suggested', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfmU0xeeBIINu1rCmc6f6DKe5yo997c5_URSoPkH1dvCnlpTs0ss_RMXTNw0rDeHT8LxPkA4oUsTH06rv-YL6TiMosbc3lOUAzTvyRs307zoBgv0nfuYM1J7mXkbRs-NO-dV8_awZeWmR9K0U8C8BoERw2qISQtBZLHA7K277W5J5RDfUkfzhriJfHSGKte9sf2hxZLfb4MA6mC3m2Vn7cxEv8432uyLf-o1NZ3qx87CKNk0faBX9vzCQ1di9zILphFidWmfsmg8A', title: 'Dramatic Silhouette' },
  ];

  return (
    <div className="page-container p-6 lg:p-10 pb-24">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary-light px-3 py-1 rounded-full border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary font-bold tracking-widest uppercase text-[10px]">Generative Space</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-text">
            Style <span className="italic font-normal text-primary">Synthesis</span>
          </h2>
          <p className="text-neutral-muted max-w-lg font-medium leading-relaxed">
            Your personal aesthetic sanctuary. We've combined your archive with high-fidelity neural inspirations to expand your creative horizons.
          </p>
        </div>
        <button className="group relative flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 hover:shadow-soft active:scale-95 shadow-soft shadow-primary/20 uppercase text-xs tracking-[0.15em]">
          <span className="material-icons-round text-lg">auto_awesome</span>
          <span>Generate Atmosphere</span>
        </button>
      </header>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
        {items.map((item, idx) => (
          <div key={idx} className="break-inside-avoid group relative overflow-hidden rounded-3xl bg-white border border-border-subtle shadow-card transition-all duration-500 hover:shadow-soft hover:border-primary/20">
            <img 
              className="w-full grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105" 
              src={item.url} 
              alt={item.title} 
            />
            <div className="absolute top-5 left-5">
              <span className={`backdrop-blur-xl text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border border-white/40 shadow-sm ${
                item.type.includes('AI') 
                  ? 'bg-primary/80 text-white border-primary/20' 
                  : 'bg-white/90 text-neutral-text'
              }`}>
                {item.type}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-text/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
              <h3 className="text-white text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Explore Details</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moodboard;
