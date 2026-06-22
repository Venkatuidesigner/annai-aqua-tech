import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductVariant } from '../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  editProductId = signal<number | null>(null);
  isSubmitting = signal(false);
  submitSuccess = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(1)]],
    capacity: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    features: this.fb.array([this.fb.control('', Validators.required)]),
    variants: this.fb.array([this.createVariantGroup()]),
  });

  get featuresArray(): FormArray { return this.form.get('features') as FormArray; }
  get variantsArray(): FormArray { return this.form.get('variants') as FormArray; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const product = this.productService.getProductById(Number(id));
      if (product) {
        this.isEdit.set(true);
        this.editProductId.set(product.id);
        this.populateForm(product);
      }
    }
  }

  private createVariantGroup(): FormGroup {
    return this.fb.group({
      colorName: ['', Validators.required],
      colorCode: ['#2196f3', Validators.required],
      images: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control(''),
      ]),
      previewImages: [[] as string[]],
    });
  }

  getVariantImages(variantIndex: number): FormArray {
    return (this.variantsArray.at(variantIndex) as FormGroup).get('images') as FormArray;
  }

  getVariantPreviewImages(variantIndex: number): string[] {
    return (this.variantsArray.at(variantIndex) as FormGroup).get('previewImages')?.value ?? [];
  }

  addFeature(): void {
    this.featuresArray.push(this.fb.control('', Validators.required));
  }

  removeFeature(index: number): void {
    if (this.featuresArray.length > 1) {
      this.featuresArray.removeAt(index);
    }
  }

  addVariant(): void {
    this.variantsArray.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    if (this.variantsArray.length > 1) {
      this.variantsArray.removeAt(index);
    }
  }

  onImageInput(event: Event, variantIndex: number, imageIndex: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const images = this.getVariantImages(variantIndex);
        images.at(imageIndex).setValue(result);

        const variant = this.variantsArray.at(variantIndex) as FormGroup;
        const previews: string[] = [...(variant.get('previewImages')?.value ?? [])];
        previews[imageIndex] = result;
        variant.get('previewImages')?.setValue(previews);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const value = this.form.value;
    const variants: ProductVariant[] = (value.variants ?? []).map((v: any) => ({
      colorName: v.colorName,
      colorCode: v.colorCode,
      images: (v.images ?? []).filter((img: string) => img && img.trim() !== ''),
    }));

    const productData = {
      name: value.name!,
      price: Number(value.price),
      capacity: value.capacity!,
      description: value.description!,
      features: (value.features ?? []).filter((f: string | null) => f && f.trim()) as string[],
      variants,
    };

    setTimeout(() => {
      if (this.isEdit() && this.editProductId() !== null) {
        this.productService.updateProduct({ ...productData, id: this.editProductId()! });
      } else {
        this.productService.addProduct(productData);
      }
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      setTimeout(() => this.router.navigate(['/admin']), 1500);
    }, 800);
  }

  private populateForm(product: Product): void {
    this.form.patchValue({
      name: product.name,
      price: product.price,
      capacity: product.capacity,
      description: product.description,
    });

    this.featuresArray.clear();
    product.features.forEach((f) => this.featuresArray.push(this.fb.control(f, Validators.required)));

    this.variantsArray.clear();
    product.variants.forEach((v) => {
      const group = this.createVariantGroup();
      group.patchValue({ colorName: v.colorName, colorCode: v.colorCode });
      const images = group.get('images') as FormArray;
      images.clear();
      v.images.forEach((img) => images.push(this.fb.control(img)));
      this.variantsArray.push(group);
    });
  }
}
