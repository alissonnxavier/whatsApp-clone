const pdfjsLib = require('pdfjs-dist');
const path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController{

    constructor(file){

        this._file = file;

    }

    getPreviewData(){

        return new Promise((resolve, reject)=>{

            switch(this._file.type){

                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                let reader = new FileReader();
                reader.onload = e=>{

                    resolve({

                        src: reader.result,
                        info: this._file.name
                    });
                }
                reader.onerror = e=>{

                    reject(e);
                }
                reader.readAsDataURL(this._file);

                break;

                case 'application/pdf':

                    let newReader = new FileReader();

                    newReader.onload = e=>{

                        pdfjsLib.getDocument(new Uint8Array(newReader.result)).then(pdf=>{

                            console.log(pdf);

                            pdf.getPage(1).then(page=>{

                                let viewport = page.getViewport(1);

                                let canvas = document.createElement('canvas');
                                let context = canvas.getContext('2d');

                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                page.render({

                                    canvasContext: context,
                                    viewport: viewport
                                }).then(()=>{

                                    let _s = (pdf.numPages > 1) ? 's' : '';

                                    resolve({

                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} pagina${_s}` 
                                    })
                                }).catch(err=>{

                                    reject(err);
                                })


                            }).catch(err=>{


                            });

                        }).catch(err=>{

                            reject(err);
                        })
                    }

                    newReader.readAsArrayBuffer(this._file);



                break;

                default:

                    resolve();
            }
        });
    }
}