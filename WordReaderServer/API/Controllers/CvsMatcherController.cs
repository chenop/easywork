using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Packaging;

namespace CvsMatcherApi.Controllers
{
    public class CvsMatcherController : ApiController
    {

        [HttpPut]
        public async Task<List<string>> MatchKeywords()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var root = HttpContext.Current.Server.MapPath("~/UploadedDocuments");
            var provider = new MultipartFormDataStreamProvider(root);

            await Request.Content.ReadAsMultipartAsync(provider);

            var docPathes = new List<string>();

            var recievedKeywords = BuildKeywordsDictionary(provider.FormData);
            var foundKeywords= new List<string>();

            foreach (MultipartFileData file in provider.FileData)
            {
                var mediaType = file.Headers.ContentType.MediaType.Substring(
                    file.Headers.ContentType.MediaType.IndexOf('/') + 1);

                var newDocumentLocalName = file.LocalFileName + "." + mediaType;

                File.Move(file.LocalFileName, newDocumentLocalName);

                docPathes.Add(newDocumentLocalName);
            }
            var tmp = new List<string>();
            foreach (var docPath in docPathes)
            {
                try
                {

                    using (var document = WordprocessingDocument.Open(docPath, false))
                    {
                        // Gets the MainDocumentPart of the WordprocessingDocument 
                        var main = document.MainDocumentPart;
                        // document fonts
                        var fonts = main.FontTablePart;
                        // document styles
                        var styles = main.StyleDefinitionsPart;
                        var effects = main.StylesWithEffectsPart;
                        // root element part of the doc
                        var doc = main.Document;
                        // actual document body
                        var body = doc.Body;
                        // styles on paragraps
                        foreach (var para in body.Descendants<Paragraph>()
                          .Where(e => e.ParagraphProperties != null && e.ParagraphProperties.ParagraphStyleId != null))
                        {
                            Console.WriteLine("Text:{0}->Style name:{1}", para.InnerText, para.ParagraphProperties.ParagraphStyleId.Val);
                        }
                        // styles on Runs
                        foreach (Run run in body.Descendants<Run>()
                          .Where(r => r.RunProperties != null && r.RunProperties.RunStyle != null))
                        {
                            tmp.Add(run.InnerText + " " + run.RunProperties.RunStyle.Val);
                        }
                    }
                }
                catch(Exception ex)
                {
                    var a = 2;
                }
            }

            return foundKeywords;
        }

        private List<string> BuildKeywordsDictionary(NameValueCollection formData)
        {
            var keywords = new List<string>();
            foreach (var key in formData.AllKeys)
            {
                if (!keywords.Contains(key))
                {
                    keywords.Add(key);
                }
            }
            return keywords;
        }
    }
}
