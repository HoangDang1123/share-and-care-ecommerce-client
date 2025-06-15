'use client'

import { getAllAttributes } from "@/app/api/attribute";
import { AllAttributeResponse, AttributeParams } from "@/interface/attribute";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttributeFilter() {
  const [attributes, setAttributes] = useState<AllAttributeResponse>();
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeParams[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await getAllAttributes();
        setAttributes(response);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    fetchAttributes();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedAttributes.length > 0) {
      params.set("attribute", encodeURIComponent(JSON.stringify(selectedAttributes)));
    } else {
      params.delete("attribute");
    }
    router.push(`/shop?${params.toString()}`);
  }, [selectedAttributes]);

  const handleToggle = (attrId: string, valueId: string) => {
    setSelectedAttributes(prev => {
      const existing = prev.find(a => a.id === attrId);

      if (existing) {
        const alreadySelected = existing.values.includes(valueId);
        const newValues = alreadySelected
          ? existing.values.filter(v => v !== valueId)
          : [...existing.values, valueId];

        if (newValues.length === 0) {
          return prev.filter(a => a.id !== attrId);
        } else {
          return prev.map(a =>
            a.id === attrId ? { ...a, values: newValues } : a
          );
        }
      } else {
        return [...prev, { id: attrId, values: [valueId] }];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedAttributes([]);
    const params = new URLSearchParams(searchParams);
    params.delete("attribute");
    router.push(`/shop?${params.toString()}`);
  };

  const renderAttribute = (attribute: AllAttributeResponse["attributes"][number]) => {
    return (
      <div key={attribute.id} className="mb-4">
        <span className="font-semibold mb-2">{attribute.name}</span>
        <div className="flex flex-wrap gap-3">
          {attribute.values.map(value => {
            const isChecked = selectedAttributes.find(a => a.id === attribute.id)?.values.includes(value.id) || false;

            return (
              <label key={value.id} className="flex items-center gap-x-2 sm:text-xs md:text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(attribute.id, value.id)}
                />
                <span>{value.value}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <span className="font-bold sm:text-lg md:text-2xl">Thuộc tính</span>
        <button
          onClick={handleClearAll}
          className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 sm:text-xs md:text-sm"
        >
          Xóa tất cả
        </button>
      </div>

      {attributes?.attributes.map(attr => renderAttribute(attr))}
    </div>
  );
}
