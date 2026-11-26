import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CAO_BANG_SPECIALTIES } from '../data/agriNextContent';

interface CaoBangExplorerProps {
  id?: string;
  kicker?: string;
  className?: string;
  onExploreCrop?: (cropId: string) => void;
  onPlayQuiz: () => void;
}

/** Interactive "Bản đồ Nông sản Cao Bằng" — 4 specialties, climate challenges & Agri-Next solutions. */
export const CaoBangExplorer: React.FC<CaoBangExplorerProps> = ({
  id = 'ban-do-nong-san',
  kicker = 'Bản đồ Nông sản Đặc hữu Cao Bằng',
  className = '',
  onExploreCrop,
  onPlayQuiz,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>(CAO_BANG_SPECIALTIES[0].id);
  const selectedCrop =
    CAO_BANG_SPECIALTIES.find((c) => c.id === selectedCropId) ?? CAO_BANG_SPECIALTIES[0];

  const handleSelectCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    onExploreCrop?.(cropId);
  };

  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="parchment-surface rounded-2xl border border-[#556B2F]/20 overflow-hidden">
        <div className="p-7 sm:p-10 lg:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-bold tracking-wider text-[#556B2F]">
                {kicker}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212122] leading-tight">
                Khám phá 4 báu vật nông nghiệp núi rừng Đông Bắc
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#585A56] max-w-sm">
              Chọn từng nông sản để tìm hiểu đặc trưng thổ nhưỡng, thách thức khí hậu và giải
              pháp canh tác tái sinh của Agri-Next.
            </p>
          </div>

          {/* Interactive Segmented Selector Tabs (functional buttons) */}
          <div
            role="tablist"
            aria-label="Danh sách nông sản Cao Bằng"
            className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#556B2F]/10"
          >
            {CAO_BANG_SPECIALTIES.map((crop) => {
              const active = crop.id === selectedCrop.id;
              return (
                <button
                  key={crop.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => handleSelectCrop(crop.id)}
                  className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#556B2F] text-white shadow-sm'
                      : 'text-[#3E5021] hover:bg-[#556B2F]/10'
                  }`}
                >
                  {crop.name}
                </button>
              );
            })}
          </div>

          {/* Asymmetric 2-Column Heritage Plate + Detailed Insight */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#556B2F]/15 bg-[#EFF5D2]">
              <img
                src="/src/assets/images/caobang_specialties_plate_1795619410092.jpg"
                alt="Bộ tranh minh họa 4 nông sản chủ lực Cao Bằng gồm hạt dẻ Trùng Khánh, thạch đen Đông Khê, miến dong Phia Đén và lê Bảo Lạc"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover min-h-[260px]"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-white/80 rounded-xl p-6 sm:p-8 border border-[#556B2F]/12">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#585A56]">
                  <span>{selectedCrop.regionLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCrop.season}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#556B2F]">
                  {selectedCrop.name}
                </h3>
                <p className="text-sm sm:text-base text-[#212122] leading-relaxed">
                  {selectedCrop.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-5 pt-2 border-t border-[#556B2F]/12">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#D9810D]">Thách thức khí hậu</div>
                    <p className="text-xs sm:text-sm text-[#585A56] leading-relaxed">
                      {selectedCrop.climateChallenge}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#556B2F]">Hướng đi Agri-Next</div>
                    <p className="text-xs sm:text-sm text-[#585A56] leading-relaxed">
                      {selectedCrop.agriNextSolution}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#556B2F]/12 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-semibold text-[#3E5021]">
                  {selectedCrop.keyMetric}
                </div>
                <button
                  type="button"
                  onClick={onPlayQuiz}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#556B2F] hover:text-[#8FA31E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Kiểm tra kiến thức về nông sản này</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
