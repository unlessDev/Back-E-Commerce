"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "./button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: any) => void;
    onRemove: (value: any) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {
    const [isMounted, SetIsMounted] = useState(false);
    
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overfloww-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4" />    
                            </Button>
                        </div>
                        <Image 
                            fill
                            className="object-cover"
                            alt="Imagen"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="qeyporjj">
                    {({ open }) => {
                        const onClick = () => {
                            open();
                        }

                        return (
                            <Button
                                type="button"
                                disabled={disabled}
                                variant="secondary"
                                onClick={onClick}
                            >
                                <ImagePlus className="h-4 w-4 mr-2" />
                                Cargar Imagenes   
                            </Button>                
                        )
                    }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;