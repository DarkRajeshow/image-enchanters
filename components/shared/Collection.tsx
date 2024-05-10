"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";

import { Search } from "./Search";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  title = "Recent Edits",
  page,
}: {
  images: IImage[];
  totalPages?: number;
  title?: string,
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredImages, setFilteredImages] = useState<IImage[]>(images);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filterImages = useCallback(() => {
    if (selectedTypes.length === 0) {
      setFilteredImages(images);
      return;
    }

    const filtered = images.filter(
      (image) => selectedTypes.indexOf(image.transformationType) > -1
    );

    setFilteredImages(filtered);
  }, [images, selectedTypes]);

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {

    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };


  const toggleAddRemoveTypes = (type: string) => {
    if (selectedTypes.indexOf(type) > -1) {
      const filteredTypes = selectedTypes.filter((selectedType) => selectedType !== type);
      setSelectedTypes(filteredTypes)
    }
    else {
      setSelectedTypes((types) => [...types, type]);
    }
  }
  useEffect(() => {
    filterImages();
  }, [selectedTypes, filterImages])

  return (
    <>
      <div className="collection-heading">
        <h2 className="h2-bold text-dark-600">{title}</h2>
        {hasSearch && <Search />}
      </div>

      <div className="transformation-buttons flex gap-1 pb-5 flex-wrap">
        <Button
          className={`bg-gray-100 rounded-full text-black ${selectedTypes.length === 0 || selectedTypes.length === 5 ? "bg-blue-300 hover:bg-red-200" : "hover:bg-blue-200"}`}
          onClick={() => setSelectedTypes([])}
        >
          All
        </Button>

        {Object.values(transformationTypes).map((transformation, index) => (
          <Button
            key={index}
            className={`bg-gray-100 rounded-full text-black flex gap-1.5 ${selectedTypes.indexOf(transformation.type) > -1 ? "bg-blue-300 hover:bg-red-200" : "hover:bg-blue-200"}`}
            onClick={() => {
              toggleAddRemoveTypes(transformation.type)
            }}
          >
            {transformation.title}
            {
              selectedTypes.indexOf(transformation.type) > -1 &&
              <X className="w-4 h-4" />
            }
          </Button>
        ))}
      </div>



      {filteredImages.length > 0 ? (
        <ul className="collection-list">
          {filteredImages.map((image) => (
            <Card image={image} key={image._id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty !bg-gray-50 !h-[60vh] flex-col gap-4">
          <Image 
            src={'/assets/icons/noresult.png'}
            alt="No result"
            height={300}
            width={300}
          />
          <p className="p-20-semibold">No results</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="collection-btn"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex-center p-16-medium w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({ image }: { image: IImage }) => {
  return (
    <li>
      <Link href={`/transformations/view/${image._id}`} className="collection-card hover:bg-blue-50">
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width}
          height={image.height}
          {...image.config}
          loading="lazy"
          className="h-72 w-full rounded-[10px] object-cover hover:scale-[1.02] transition-all"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
            {image.title}
          </p>
          <Image
            src={`/assets/icons/${transformationTypes[
              image.transformationType as TransformationTypeKey
            ].icon
              }`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};