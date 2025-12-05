'use client'
import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import { IoClose, IoCameraOutline } from 'react-icons/io5';

interface ImagePreview {
  file: File;
  previewUrl: string;
}
interface UploadImageProps {
  onFilesSelected: (files: File[]) => void; 
}

export default function UploadImage({ onFilesSelected }: UploadImageProps) {
    const [images, setImages] = useState<ImagePreview[]>([]);
    const [isDragging, setIsDragging] = useState(false); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const filesOnly = images.map(img => img.file);
        onFilesSelected(filesOnly);
    }, [images, onFilesSelected]);

    const processFiles = (files: FileList | null) => {
        if (!files) return;

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        const newImages: ImagePreview[] = imageFiles.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files); 
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    useEffect(() => {
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.previewUrl));
        };
    }, [images]);

    return (
        <div className="space-y-3">
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    w-full h-32 border-2 border-dashed rounded-lg p-4 
                    flex flex-col items-center justify-center text-center 
                    transition-all cursor-pointer
                    ${isDragging 
                        ? 'border-purple-600 bg-purple-100 scale-[1.02]'
                        : 'border-purple-400 bg-purple-50/50 text-purple-600 hover:bg-purple-100' 
                    }
                `}
            >
                <IoCameraOutline size={40} className={isDragging ? 'text-purple-700' : ''} />
                <p className="text-sm font-medium mt-2">
                    {isDragging ? "Solte as imagens aqui!" : "Clique ou arraste fotos aqui"}
                </p>
                <p className={`text-xs mt-1 ${isDragging ? 'text-purple-600' : 'text-purple-400'}`}>
                    {images.length} fotos selecionadas
                </p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {images.map((img, index) => (
                        <div key={index} className="relative w-full h-24 border-2 border-purple-200 rounded-lg overflow-hidden group">
                            <img 
                                src={img.previewUrl} 
                                alt={`Preview ${index}`} 
                                className="w-full h-full object-cover"
                            />
                            <button 
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                type="button"
                            >
                                <IoClose size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}