"use client";

import { Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface RatingCardProps {
  name: string;
  category: string;
  testimonial: string;
  rating: number;
  image: string;
}

const RatingCard = ({
  name,
  category,
  testimonial,
  rating,
  image,
}: RatingCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 flex flex-col h-full transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2 group cursor-default"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-white shrink-0 overflow-hidden relative border border-gray-100 p-1">
          <Image src={image} alt={name} fill className="object-contain p-1" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
          <p className="text-xs text-gray-500">{category}</p>
        </div>
      </div>

      <div className="relative pl-6 mb-8 grow">
        {/* Decorative Blue Line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#081f5c] rounded-full opacity-80 group-hover:w-1 transition-all duration-300" />
        <p className="text-gray-600 text-sm leading-relaxed italic">
          &quot;{testimonial}&quot;
        </p>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? "fill-[#ff6f00] text-[#ff6f00]"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-gray-900">
          {rating.toFixed(1)}
        </span>
      </div>
    </motion.div>
  );
};

export default function RatingSection() {
  const ratings = [
    {
      name: "SMKN 31 Jakarta",
      category: "School",
      testimonial:
        "Saya sangat puas dengan hasil kerja freelancer ini. Proyek website 7 Kegiatan Anak Indonesia Hebat dikerjakan dengan profesional, rapi, dan sesuai dengan kebutuhan sekolah. Komunikasi berjalan lancar, setiap revisi ditangani dengan cepat, dan hasil akhirnya melebihi ekspektasi saya. Desainnya menarik, fungsionalitasnya berjalan baik, serta sistemnya mudah digunakan oleh guru maupun siswa. Terima kasih atas kerja keras dan dedikasinya",
      rating: 5.0,
      image: "/assets/img/smkn31.svg",
    },
    {
      name: "Sagawa Group",
      category: "SME's Partner",
      testimonial:
        "Kami sangat puas dengan hasil pembuatan website yang kami terima. Dalam waktu kurang dari dua bulan, kami tidak hanya mendapatkan sebuah website yang modern dan responsif, tetapi juga alat pemasaran yang sangat efektif. Desain yang menarik dan kemudahan akses melalui berbagai perangkat, ditambah dengan fitur pemesanan online yang praktis, semuanya memberikan nilai lebih untuk waralaba kami. Kami yakin bahwa dengan adanya website ini, kami bisa terus mengembangkan usaha dan mencapai audiens yang lebih luas dengan cara yang lebih efisien dan profesional.",
      rating: 5.0,
      image: "/assets/img/sagawa_logo.svg",
    },
    {
      name: "AWA Construction",
      category: "SME's Partner",
      testimonial:
        "Sebagai sebuah UMKM, sering kali kita menghadapi tantangan besar dalam memasarkan produk dan layanan, terutama ketika dana terbatas dan sumber daya terbatas. Namun, salah satu pelanggan kami, yang merupakan usaha kecil yang bergerak di bidang jasa konstruksi dan renovasi, telah merasakan manfaat besar setelah menggunakan platform Freelinkd.",
      rating: 5.0,
      image: "/assets/img/awa_contruction_logo.svg",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-20 px-6 lg:px-20 bg-(--background) overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#081f5c] mb-6">
            SME&apos;s Rating
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We connect talented freelancers with SMEs to deliver high-quality
            projects and flexible collaboration models. Explore how we can help
            you grow.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {ratings.map((item, index) => (
            <RatingCard key={index} {...item} />
          ))}
        </motion.div>

        {/* Carousel Indicator */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
